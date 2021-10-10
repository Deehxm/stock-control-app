import './App.css';
import { Layout, PageHeader } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import ProductPage from './pages/product';

function App() {
  return (
    <Router>
      <Layout style={{ height: '100vh' }}>
        <Layout>
            <PageHeader
              title="Controle de Estoque"
              subTitle="Listagem de Produtos"
              style={{border: '1px solid rgb(235, 237, 240)', backgroundColor:'#FFF'}}
            />
          <Switch>
            <Route path='/' exact component={ProductPage} />
          </Switch>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
