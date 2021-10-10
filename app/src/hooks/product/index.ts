import { message } from 'antd';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useProductListController = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState<{
        code: string;
        description: string;
        type: string;
    }>();
    const [productSelected, setProductSelected] = useState<{
        _id: string
        code: string,
        description: string,
        type: string,
        supplierValue: number,
        qtyStock: number,
        qtySold: number
    }>();
    const [visibleProductDrawer, setVisibleProductDrawer] = useState(false);
    const [visibleMovementDrawer, setVisibleMovementDrawer] = useState(false);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);

    const requestPostOptions = (body: any) => {
        return {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }
    }

    useEffect(() => {
        async function loadProducts() {
            setLoading(true);
            let args = '';
            if (filters) {
                if (filters.code) {
                    args = '?code=' + filters.code
                }
                if (filters.description) {
                    args += args.length > 0 ? '&' : '?';
                    args += 'description=' + filters.description
                }
                if (filters.type) {
                    args += args.length > 0 ? '&' : '?';
                    args += 'type=' + filters.type
                }
            }

            let movData: any[];
            const mov = await fetch(`/profit`);
            await mov.json().then((res) => movData = res);

            const data = await fetch(`/products${args}`);
            await data.json()
                .then(res => setProducts(
                    res.map((el: any) => {
                        const totalSaleValue = movData.find(mov => mov._id.product === el._id)?.totalSaleValue;
                        el.supplierValue = Number(el.supplierValue).toFixed(2);
                        return {
                            key: uuidv4(),
                            totalProfit: totalSaleValue ? (totalSaleValue - (el.qtySold * el.supplierValue)).toFixed(2) : Number(0).toFixed(2),
                            hasMovement: el.qtyStock > 0 || el.qtySold > 0,
                            ...el
                        }
                    })
                ))
                .finally(() => setLoading(false));
        }
        loadProducts();

    }, [reload, filters]);

    const onOpenMovementDrawer = (record: any) => {
        setProductSelected(record);
        setVisibleMovementDrawer(true);
    }

    const onCloseMovementDrawer = () => {
        setProductSelected(undefined);
        setVisibleMovementDrawer(false);
    }

    const onSaveMovement = async (values: any) => {
        await fetch('/addMovement', requestPostOptions(values))
            .then((res) => {
                if (res.status === 200) {
                    setReload(!reload);
                    onCloseMovementDrawer();
                    message.success('Movimento incluído com sucesso!')
                }
                else throw new Error('Saldo insuficiente.');
            })
            .catch((err) => message.error('Erro ao incluir movimento. ' + err));
    }

    const onOpenProductDrawer = (record?: any) => {
        if (record._id)
            setProductSelected(record);
        setVisibleProductDrawer(true);
    }

    const onCloseProductDrawer = () => {
        setProductSelected(undefined);
        setVisibleProductDrawer(false);
    }

    const onFilterProduct = async (values: any) => {
        setFilters(values);
    }

    const onDeleteProduct = async (values: any) => {
        await fetch('/deleteProduct/' + values._id, {
            method: 'DELETE'
        })
            .then(() => {
                setReload(!reload);
                message.success('Produto excluído com sucesso!')
            })
            .catch(() => message.error('Erro ao excluir produto.'));
    }

    const onSaveProduct = async (values: any) => {
        if (values.code) {
            await fetch('/editProduct', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })
                .then(() => {
                    setReload(!reload);
                    onCloseProductDrawer();
                    message.success('Produto alterado com sucesso!')
                })
                .catch(() => message.error('Erro ao editar produto.'));
        } else {
            await fetch('/addProduct', requestPostOptions(values))
                .then(() => {
                    setReload(!reload);
                    onCloseProductDrawer();
                    message.success('Produto incluído com sucesso!')
                })
                .catch(() => message.error('Erro ao incluir produto.'));
        }
    }

    return {
        products,
        onSaveMovement,
        onSaveProduct,
        onOpenMovementDrawer,
        visibleMovementDrawer,
        onCloseMovementDrawer,
        onOpenProductDrawer,
        visibleProductDrawer,
        onCloseProductDrawer,
        productSelected,
        onDeleteProduct,
        onFilterProduct,
        loading
    }
}