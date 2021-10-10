import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Layout, Select } from 'antd';

export const AddMovement: React.FC<
  {
    onSave: (values: any) => Promise<void>;
    product: any;
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
            <Form.Item label='Código do Produto' name='product' initialValue={product ? product.code : undefined}>
              <Input disabled />
            </Form.Item>
            <Form.Item label='Tipo de Movimento' name='type'
              rules={[{ required: true, message: 'Tipo de movimento obrigatório.' }]}>
              <Select>
                <Select.Option value='I'>Entrada</Select.Option>
                <Select.Option value='O'>Saída</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label='Valor' name='saleValue'
              rules={[{ required: true, message: 'Valor de venda obrigatório.' }]}>
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
            <Form.Item label='Quantidade' name='qty'
              rules={[{ required: true, message: 'Quantidade obrigatória.' }]}>
              <InputNumber min={1} />
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
  };
