import { Button, Drawer, Layout, Space, Spin, Table, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useProductListController } from '../../hooks/product';
import { AddMovement } from '../../components/movement';
import { Product } from '../../components/product';
import { ProductFilterBar } from '../../components/product-filter-bar';

function ProductPage() {
  const {
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
  } = useProductListController();

  return (
    <>
      <Layout.Content style={{ backgroundColor: '#FFF', padding: '20px', margin: '12px 25px', borderRadius:'4px', flex:'initial'}}>
        <ProductFilterBar onFilter={onFilterProduct} onNew={onOpenProductDrawer} />
      </Layout.Content>
      <Layout.Content style={{ margin: '0 25px 25px 25px' }}>

        <Spin spinning={loading}>
          <Table
            columns={

              [
                {
                  title: 'Código',
                  dataIndex: 'code',
                  key: 'code',
                  render: text => <span>{text}</span>
                },
                {
                  title: 'Descrição',
                  dataIndex: 'description',
                  key: 'description',
                  render: text => <span>{text}</span>
                },
                {
                  title: 'Tipo',
                  dataIndex: 'type',
                  key: 'type',
                  render: text => <span>{text}</span>
                },
                {
                  title: 'Valor no Fornecedor',
                  key: 'supplierValue',
                  dataIndex: 'supplierValue',
                  align: 'right',
                  render: text => <span>{
                    `${text}`
                      .replace(/\./, ',')
                      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                  }</span>
                },
                {
                  title: 'Quantidade em Estoque',
                  key: 'qtyStock',
                  dataIndex: 'qtyStock',
                  align: 'right',
                  render: text => <span>{text}</span>
                },
                {
                  title: 'Qtd. de Saída',
                  key: 'qtySold',
                  dataIndex: 'qtySold',
                  align: 'right',
                  render: text => <span>{text}</span>
                },
                {
                  title: 'Total de Lucro',
                  key: 'totalProfit',
                  dataIndex: 'totalProfit',
                  align: 'right',
                  render: text => <span>{
                    `${text}`
                      .replace(/\./, ',')
                      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                  }</span>
                },
                {
                  title: 'Ações',
                  key: 'actions',
                  align: 'center',
                  render: (text, record: any) => (
                    <Space size='middle'>
                      <Tooltip title={'Editar'}>
                        <Button onClick={() => onOpenProductDrawer(record)} icon={<EditOutlined />} />
                      </Tooltip>

                      <Tooltip title={record.hasMovement ? 'Exclusão bloqueada. Produto com movimento de estoque.' : 'Excluir'}>
                        <Button onClick={() => onDeleteProduct(record)} icon={<DeleteOutlined />} disabled={record.hasMovement} />
                      </Tooltip>

                      <Tooltip title={'Movimentar'}>
                        <Button onClick={() => onOpenMovementDrawer(record)} icon={<ShoppingCartOutlined />} />
                      </Tooltip>
                    </Space>
                  )
                }
              ]

            } dataSource={products} />
        </Spin>
        <Layout.Content>
          <Drawer title={`Movimentar Produto ${productSelected?.description}`} width='40%' destroyOnClose={true} visible={visibleMovementDrawer} onClose={onCloseMovementDrawer}>
            <AddMovement
              onSave={onSaveMovement}
              product={productSelected} />
          </Drawer>
          <Drawer title={productSelected ? `Editar Produto ${productSelected.description}` : 'Novo Produto'} width='40%' destroyOnClose={true} visible={visibleProductDrawer} onClose={onCloseProductDrawer}>
            <Product
              onSave={onSaveProduct}
              product={productSelected} />
          </Drawer>
        </Layout.Content>

      </Layout.Content>
    </>
  );
}

export default ProductPage;