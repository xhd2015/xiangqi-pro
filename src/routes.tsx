import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { XiangqiJSChess } from './page/XiangqiJSChess';
import { Chess } from './page/Chess';


export default () => {
    // console.log("params:", env.showInternalMenu, params, [...params.keys()])

    return <BrowserRouter>
        <Routes>

            <Route path="/" element={<Layout />}>
                <Route path="chess" element={<Chess />}></Route>
                <Route path="chess/xiangqijs" element={<XiangqiJSChess />}></Route>

                <Route
                    path="*"
                    element={
                        <main style={{ padding: '1rem' }}>
                            <p>Not found!</p>
                        </main>
                    }
                />
            </Route>
        </Routes>
    </BrowserRouter >
}


