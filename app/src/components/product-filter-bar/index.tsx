import React from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Layout, Row, Select } from 'antd';

export const ProductFilterBar: React.FC<
  {
    onFilter: (values: any) => Promise<void>;
    onNew: () => void;
  }> = (
    {
      onFilter,
      onNew
    }
  ) => {
    const [form] = Form.useForm();

    return (
      <Row >
        <Col span={18}>
          <Layout.Content >
            <Form
              form={form}
              onFinish={onFilter}
              layout={'inline'}
              initialValues={{ layout: 'inline' }}
            >
              <Form.Item label='Código' name='code'>
                <Input placeholder='Código do produto' allowClear />
              </Form.Item>
              <Form.Item label='Descrição' name='description'>
                <Input placeholder='Descrição do produto' allowClear/>
              </Form.Item>
              <Form.Item label='Tipo' name='type'>
                <Select allowClear style={{width:'150px'}} placeholder='Selecione'>
                  <Select.Option value='ELE'>Eletrônico</Select.Option>
                  <Select.Option value='APP'>Eletrodoméstico</Select.Option>
                  <Select.Option value='MOB'>Móvel</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item >
                <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
                  Pesquisar
                </Button>
              </Form.Item>
            </Form>
          </Layout.Content>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          <Button type='primary' onClick={onNew} icon={<PlusOutlined />}>
            Novo Produto
          </Button>
        </Col>
      </Row>
    );
  }
