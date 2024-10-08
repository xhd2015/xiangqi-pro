import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { ChessLayoutDemo } from './page/ChessBoardDemo';
import { ChessBoardStepDemo } from './page/ChessBoardStepDemo';
import { StepDemo } from './page/StepDemo';
import { XiangqiJSChess } from './page/XiangqiJSChess';

export default () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="demo/chess" element={<ChessLayoutDemo />}></Route>
                <Route path="demo/step" element={<StepDemo />} />
                <Route path="demo/chessStep" element={<ChessBoardStepDemo />} />
                <Route path="demo/chess/xiangqijs" element={<XiangqiJSChess />}></Route>

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