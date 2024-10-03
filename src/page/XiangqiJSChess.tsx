import { CSSProperties, useEffect, useRef } from "react"

{/* <div id="myBoard" style="width: 450px"></div>
<button id="moveRandom">Move Random</button>
<script>
    function onChange(oldPos, newPos) {
        console.log('Position changed:', oldPos, newPos);
        console.log('Old position: ' + Xiangqiboard.objToFen(oldPos));
        console.log('New position: ' + Xiangqiboard.objToFen(newPos));
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    }

    const config = {
        draggable: true,
        position: 'start',
        onChange: onChange,
    };
    const board = Xiangqiboard('myBoard', config);

    document.getElementById("moveRandom").addEventListener("click", function () {
        board.move("e0-e1")
    })
</script> */}

// # Download images
// ```sh
// IMG=img/xiangqipieces/wikimedia/bK.svg
// mkdir -p "$(dirname "$IMG")"
// curl -sL "https://lengyanyu258.github.io/xiangqiboardjs/$IMG" -o "$IMG"
// ```

// interface Xiangqiboard {} 
let Xiangqiboard: any = window['Xiangqiboard']

export interface chessProps {
    style?: CSSProperties
    className?: string
}

export function XiangqiJSChess(props: chessProps) {
    const el = useRef()
    useEffect(() => {
        function onChange(oldPos, newPos) {
            console.log('Position changed:', oldPos, newPos);
            console.log('Old position: ' + Xiangqiboard.objToFen(oldPos));
            console.log('New position: ' + Xiangqiboard.objToFen(newPos));
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        }

        const config = {
            draggable: true,
            position: 'start',
            onChange: onChange,

        };
        const board = Xiangqiboard(el.current, config);
        // document.getElementById("moveRandom").addEventListener("click", function () {
        //     board.move("e0-e1")
        // })
    }, [])

    return <div ref={el} className={props.className} style={{
        // height: "400px",
        width: "450px",
        ...props.style
    }}>
    </div>
}