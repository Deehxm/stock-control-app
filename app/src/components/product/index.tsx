import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Layout, Select } from 'antd';

export const Product: React.FC<
  {
    onSave: (values: any) => Promise<void>;
    product?: any;
  }> = (
    {
      onSave,
      product
    }
  ) => {
    const [form] = Form.useForm();

    return (
      <Layout.Content>
        <Layout.Content>
          <Form
            form={form}
            onFinish={onSave}
            layout={'vertical'}
            initialValues={{ layout: 'vertical' }}
          >
            {product && (
              <Form.Item label='Código' name='code' initialValue={product ? product.code : undefined}>
                <Input disabled />
              </Form.Item>)}
            <Form.Item label='Descrição' name='description' initialValue={product ? product.description : undefined}
              rules={[{ required: true, message: 'Descrição do produto obrigatória.' }]}>
              <Input />
            </Form.Item>
            <Form.Item label='Tipo' name='type' initialValue={product ? product.type : undefined}
              rules={[{ required: true, message: 'Tipo de produto obrigatório.' }]}>
              <Select disabled={product}>
                <Select.Option value='ELE'>Eletrônico</Select.Option>
                <Select.Option value='APP'>Eletrodoméstico</Select.Option>
                <Select.Option value='MOB'>Móvel</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label='Valor no Fornecedor' name='supplierValue' initialValue={product ? product.supplierValue : undefined}
              rules={[{ required: true, message: 'Valor no fornecedor do produto obrigatório.' }]}>
              <InputNumber
                formatter={(value) =>
                  `${value}`
                    .replace(/\./, ',')
                    .replace('-', '')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                }
                parser={(x) =>
                  `${x}`
                    .replace(/\s?/g, '')
                    .replace(/,/, '#')
                    .replace(/\./g, '')
                    .replace(/#/, '.')
                }
                precision={2}
              />
            </Form.Item>
            <Form.Item >
              <Button type='primary' htmlType='submit' icon={<CheckOutlined />}>
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Layout.Content>
      </Layout.Content>
    );
  }
