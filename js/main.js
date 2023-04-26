const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const A4Direction = "v";
var A4Width = 1240;
var A4Height = 1754;

window.onload = function () {

}

//////////////////////
//程序入口
////////////////////
function Start() {
    if (A4Direction == "w") {
        [A4Width, A4Height] = [A4Height, A4Width];
    }

    canvas.width = A4Width;
    canvas.height = A4Height;
}

//变量定义
var rowNumber = 8;
var colNumber = 8;
var m_LineStyleWidth = 0.1;
var m_CircleStyleWidth = 0.05;
var m_BlockCellWidth = 0.7;
var datas = {};
var m_numWord = 16;
var m_wordIndexs = [];
var m_category;
var m_drawBoard;
var m_hard = 2;

function CreateA4(category) {
    m_category = category;
    m_drawBoard = new CDrawBoard(ctx);
    //二维码
    let loadImg0 = function () {
        m_drawBoard.DrawImage('./qr.png', () => {
            toastDlg.Close();
            ShowImageDlg();
        }, [50, 50, 180, 180]);
    }

    var toastDlg = new Toast({
        text: "生成中"
    });
    toastDlg.Show();
    m_drawBoard.ClearRect();
    if (category <= 3) {
        m_drawBoard.WriteText("数字扫雷", 8.0, 2.0, 1.4);
    } else if (category <= 7) {
        m_drawBoard.WriteText("数字搭桥", 8.0, 2.0, 1.4);
    } else if (category <= 9) {
        m_drawBoard.WriteText("舒尔特表", 8.0, 2.0, 1.4);
    } else if (category <= 13) {
        m_drawBoard.WriteText("数 方", 8.0, 2.0, 1.4);
    } else if (category <= 17) {
        m_drawBoard.WriteText("数 回", 8.0, 2.0, 1.4);
    }else if (category <= 20) {
        m_drawBoard.WriteText("数 连", 8.0, 2.0, 1.4);
    }

    if (category == 1) {
        m_hard = 2;
        m_BlockCellWidth = 1.4;
        CreateOneBox(1.5, 7);
        CreateOneBox(11.5, 7);
        CreateOneBox(1.5, 18);
        CreateOneBox(11.5, 18);
    } else if (category == 2) {
        m_hard = 3;
        m_BlockCellWidth = 1.0;
        CreateOneBox(5.5, 5);
        CreateOneBox(5.5, 18);
    } else if (category == 3) {
        m_hard = 4;
        m_BlockCellWidth = 0.8;
        CreateOneBox(5.0, 4.5);
        CreateOneBox(5.0, 17.5);
    } else if (category == 4) {
        m_BlockCellWidth = 1.5;
        m_hard = 3;
        CreateOneBoxHaship(2.5, 7);
        CreateOneBoxHaship(12.5, 7);
        CreateOneBoxHaship(2.5, 18);
        CreateOneBoxHaship(12.5, 18);
    } else if (category == 5) {
        m_BlockCellWidth = 1.3;
        m_hard = 4;
        CreateOneBoxHaship(1.5, 7);
        CreateOneBoxHaship(11.5, 7);
        CreateOneBoxHaship(1.5, 18);
        CreateOneBoxHaship(11.5, 18);
    } else if (category == 6) {
        m_BlockCellWidth = 1.15;
        m_hard = 5;
        CreateOneBoxHaship(5.5, 4.5);
        CreateOneBoxHaship(5.5, 17);
    } else if (category == 7) {
        m_BlockCellWidth = 1.15;
        m_hard = 6;
        CreateOneBoxHaship(5.5, 4.5);
        CreateOneBoxHaship(5.5, 17);
    } else if (category == 8) {
        //舒尔特表（Schulte Grid）
        m_BlockCellWidth = 1.5;
        m_hard = 1;
        CreateOneBoxSchult(1.5, 7);
        CreateOneBoxSchult(11.5, 7);
        CreateOneBoxSchult(1.5, 18);
        CreateOneBoxSchult(11.5, 18);
    } else if (category == 9) {
        //舒尔特表（Schulte Grid）
        m_BlockCellWidth = 1.45;
        m_hard = 2;
        CreateOneBoxSchult(5.5, 4.5);
        CreateOneBoxSchult(5.5, 17);
    } else if (category == 10) {
        //数方(入门)
        m_BlockCellWidth = 1.5;
        m_hard = 1;
        CreateOneBoxShiKaKu(1.5, 7);
        CreateOneBoxShiKaKu(11.5, 7);
        CreateOneBoxShiKaKu(1.5, 18);
        CreateOneBoxShiKaKu(11.5, 18);
    } else if (category == 11) {
        //数方(简单)
        m_BlockCellWidth = 1.5;
        m_hard = 2;
        CreateOneBoxShiKaKu(1.5, 7);
        CreateOneBoxShiKaKu(11.5, 7);
        CreateOneBoxShiKaKu(1.5, 18);
        CreateOneBoxShiKaKu(11.5, 18);
    } else if (category == 12) {
        //数方(中等)
        m_BlockCellWidth = 1.45;
        m_hard = 3;
        CreateOneBoxShiKaKu(5.5, 4.5);
        CreateOneBoxShiKaKu(5.5, 17);
    } else if (category == 13) {
        //数方(困难)
        m_hard = 4;
        m_BlockCellWidth = 0.95;
        CreateOneBoxShiKaKu(5.0, 4.5);
        CreateOneBoxShiKaKu(5.0, 17.5);
    } else if (category == 14) {
        //数回(入门)
        m_BlockCellWidth = 1.5;
        m_hard = 1;
        CreateOneBoxSlitherlink(1.5, 7);
        CreateOneBoxSlitherlink(11.5, 7);
        CreateOneBoxSlitherlink(1.5, 18);
        CreateOneBoxSlitherlink(11.5, 18);
    } else if (category == 15) {
        //数回(简单)
        m_BlockCellWidth = 1.5;
        m_hard = 2;
        CreateOneBoxSlitherlink(1.5, 7);
        CreateOneBoxSlitherlink(11.5, 7);
        CreateOneBoxSlitherlink(1.5, 18);
        CreateOneBoxSlitherlink(11.5, 18);
    } else if (category == 16) {
        //数回(中等)
        m_BlockCellWidth = 1.45;
        m_hard = 3;
        CreateOneBoxSlitherlink(5.5, 4.5);
        CreateOneBoxSlitherlink(5.5, 17);
    } else if (category == 17) {
        //数回(困难)
        m_hard = 4;
        m_BlockCellWidth = 1.10;
        CreateOneBoxSlitherlink(5.0, 4.5);
        CreateOneBoxSlitherlink(5.0, 17.5);
    } else if (category == 18) {
        //数连(入门)
        m_BlockCellWidth = 1.3;
        m_hard = 1;
        CreateOneBoxNumberlink(1.5, 7);
        CreateOneBoxNumberlink(11.5, 7);
        CreateOneBoxNumberlink(1.5, 18);
        CreateOneBoxNumberlink(11.5, 18);
    } else if (category == 19) {
        //数连(中等)
        m_BlockCellWidth = 1.1;
        m_hard = 2;
        CreateOneBoxNumberlink(5.5, 4.5);
        CreateOneBoxNumberlink(5.5, 17);
    } else if (category == 20) {
        //数连(困难)
        m_hard = 3;
        m_BlockCellWidth = 0.85;
        CreateOneBoxNumberlink(4.5, 4.2);
        CreateOneBoxNumberlink(4.5, 17.2);
    } 

    //贴图
    loadImg0();
}

//生成数字地雷棋盘
function CreateOneBox(x, y) {
    //1.生成棋盘
    let chess1 = new CMineMap();
    chess1.CreateChessData(m_hard);
    //2.绘制表格
    DrawBlocks(x, y, chess1);
}

//生成一个数桥棋盘
function CreateOneBoxHaship(x, y) {
    //1.生成数桥Hashi棋盘
    let hashiData = new CHashiMap();
    hashiData.CreateChessData(m_hard);
    //console.log(hashiData);
    //2.绘制
    DrawHashiPath(x, y, hashiData);
}

//生成一个舒尔特表
function CreateOneBoxSchult(x, y) {
    let chess1 = new CSchulteGrid();
    chess1.SetHard(m_hard);
    DrawSchultGrid(x, y, chess1);
}

//生成一个数方
function CreateOneBoxShiKaKu(x, y) {
    //1.生成棋盘
    let chess1 = new CShiKaKuGrid();
    chess1.SetHard(m_hard);
    //3.绘制表格
    DrawShiKaku(x, y, chess1);
}

//生成一个数回
function CreateOneBoxSlitherlink(x, y) {
    //1.生成棋盘
    let chess1 = new CSlitherlinkGrid();
    chess1.SetHard(m_hard);
    //3.绘制表格
    DrawSlitherlink(x, y, chess1);
}

//生成一个数连
function CreateOneBoxNumberlink(x, y){
    //1.生成棋盘
    let chess1 = new CNumberlinkGrid();
    chess1.SetHard(m_hard);
    //3.绘制表格
    DrawNumberlink(x, y, chess1);
}

//绘制数字地雷方格
function DrawBlocks(x0, y0, chess1) {
    let x1 = x0;
    let y1 = y0;
    //显示地雷数
    m_drawBoard.WriteText("地雷数: " + chess1.numMine, x1, y1 - 0.4, 0.6);

    for (let y = 0; y < chess1.numRow; y++) {
        for (let x = 0; x < chess1.numCol; x++) {
            //1.绘制方格
            //DrawOneBlock(x1, y1);
            m_drawBoard.DrawSquare(x1, y1, m_BlockCellWidth);
            //2.显示数字
            let c1 = chess1.boxs[y][x];
            if (c1.id2 == 1) {
                let str1 = c1.id + "";
                //3.绘制文字
                m_drawBoard.WriteText(str1, x1 + 0.2 * m_BlockCellWidth, y1 + 0.7 * m_BlockCellWidth, 0.7);
            } else if (c1.tag == "m") {
                //显示地雷
                // m_drawBoard.WriteText("x", x1 + 0.2 * m_BlockCellWidth, y1 + 0.7 * m_BlockCellWidth, 0.7);
            }

            x1 = x1 + m_BlockCellWidth;
        }
        y1 = y1 + m_BlockCellWidth;
        x1 = x0;
    }
}

//绘制数桥路径
function DrawHashiPath(x0, y0, chess1) {
    let x1 = x0;
    let y1 = y0;
    //绘制表格
    for (let y = 0; y < chess1.numRow - 1; y++) {
        for (let x = 0; x < chess1.numCol - 1; x++) {
            //1.绘制方格
            m_drawBoard.DrawSquare(x1, y1, m_BlockCellWidth, "grey", "dash");
            x1 = x1 + m_BlockCellWidth;
        }
        y1 = y1 + m_BlockCellWidth;
        x1 = x0;
    }
    //绘制路径 和 节点，并显示节点上的桥数量
    for (let i = 0; i < chess1.CountPath; i++) {
        let path1 = chess1.paths[i];

        for (let j = 0; j < path1.Count - 1; j++) {
            let c1 = path1.GetAt(j);
            let c2 = path1.GetAt(j + 1);
            //绘制
            let dx1 = x0 + m_BlockCellWidth * c1.x;
            let dy1 = y0 + m_BlockCellWidth * c1.y;
            let dx2 = x0 + m_BlockCellWidth * c2.x;
            let dy2 = y0 + m_BlockCellWidth * c2.y;
            //绘制圆
            m_drawBoard.DrawCircle(dx1, dy1, m_BlockCellWidth * 0.2, 0, 0, "", "white");
            m_drawBoard.DrawCircle(dx2, dy2, m_BlockCellWidth * 0.2, 0, 0, "", "white");
            //绘制桥数
            let str1 = c1.id + "";
            let str2 = c2.id + "";
            m_drawBoard.WriteText(str1, dx1 - 0.10 * m_BlockCellWidth, dy1 + 0.15 * m_BlockCellWidth, 0.5);
            m_drawBoard.WriteText(str2, dx2 - 0.10 * m_BlockCellWidth, dy2 + 0.15 * m_BlockCellWidth, 0.5);
            //绘制连线
            //m_drawBoard.DrawLine(dx1, dy1, dx2, dy2, 0.08, 60, "red");

        }
    }

}

//绘制舒尔特表（Schulte Grid）
function DrawSchultGrid(x0, y0, chess1) {
    let x1 = x0;
    let y1 = y0;
    //显示地雷数
    m_drawBoard.WriteText("缺数字______ ", x1, y1 - 0.6, 0.6);

    for (let y = 0; y < chess1.numRow; y++) {
        for (let x = 0; x < chess1.numCol; x++) {
            //1.绘制方格
            m_drawBoard.DrawSquare(x1, y1, m_BlockCellWidth);
            //2.显示数字
            let c1 = chess1.boxs[y][x];
            if (c1.id > 0) {
                let str1 = c1.id + "";
                //3.绘制文字
                m_drawBoard.WriteText(str1, x1 + 0.2 * m_BlockCellWidth, y1 + 0.7 * m_BlockCellWidth, 0.7);
            }
            x1 = x1 + m_BlockCellWidth;
        }
        y1 = y1 + m_BlockCellWidth;
        x1 = x0;
    }
}

//绘制数方Shikaku
function DrawShiKaku(x0, y0, chess1) {
    let x1 = x0;
    let y1 = y0;
    //记录文字的绘制顺序
    let showSeq = {};
    for (let y = 0; y < chess1.numRow; y++) {
        for (let x = 0; x < chess1.numCol; x++) {
            //1.绘制方格
            m_drawBoard.DrawSquare(x1, y1, m_BlockCellWidth, "grey", "dash");
            let str1 = "";
            //2.获得所在range
            let rang1 = chess1.GetRangeByPosition(x, y);
            //3.获得当前位置在rang1中的序号
            let idx1 = rang1.GetInsideNumber(x, y);
            //4.随机一个序号，用于判断是否显示
            if (showSeq[rang1.id] == undefined) {
                showSeq[rang1.id] = CArrayHelper.RandomInt(0, rang1.Count - 1);
            }
            let idx2 = showSeq[rang1.id];
            //5.显示占位的数量
            str1 = rang1.Count + "";
            //6.是否显示
            if (idx1 != idx2) {
                str1 = "";
            }
            //7.绘制文字
            m_drawBoard.WriteText(str1, x1 + 0.18 * m_BlockCellWidth, y1 + 0.7 * m_BlockCellWidth, 0.65);
            x1 = x1 + m_BlockCellWidth;
        }
        y1 = y1 + m_BlockCellWidth;
        x1 = x0;
    }
}

//绘制数回Slitherlink
function DrawSlitherlink(x0, y0, chess1) {
    let x1 = x0;
    let y1 = y0;
    for (let y = 0; y < chess1.numRow; y++) {
        for (let x = 0; x < chess1.numCol; x++) {
            //1.绘制方格
            m_drawBoard.DrawSquare(x1, y1, m_BlockCellWidth, "grey", "dash");
            let str1 = "";
            //3.获得当前位置在rang1中的序号
            let idx1 = chess1.boxs[y][x].id;
            let idx2 = chess1.boxs[y][x].id2;
            let bShow = chess1.boxs[y][x].show;
            //5.显示占位的数量
            //7.绘制文字
            if(bShow){
                str1 = idx2 + "";
            }
            // if(idx1 == -1){
            //     str1 = idx1 + "";
            // }
            //绘制 
            if(str1 != ""){
                m_drawBoard.WriteText(str1, x1 + 0.18 * m_BlockCellWidth, y1 + 0.7 * m_BlockCellWidth, 0.65);
            }
            
            x1 = x1 + m_BlockCellWidth;
        }
        y1 = y1 + m_BlockCellWidth;
        x1 = x0;
    }
}

//绘制数连Numberlink
function DrawNumberlink(x0, y0, chess1) {
    let x1 = x0;
    let y1 = y0;
    //m_drawBoard.DrawSquare(x0, y0, m_BlockCellWidth * chess1.numRow, "grey", "dash");
    for (let y = 0; y < chess1.numRow; y++) {
        for (let x = 0; x < chess1.numCol; x++) {
            let str1 = "";
            //3.获得当前位置在rang1中的序号
            let idx1 = chess1.boxs[y][x].id;
            let idx2 = chess1.boxs[y][x].id2;
            let bShow = chess1.boxs[y][x].show;
            //5.显示占位的数量
            //7.绘制文字
            if(bShow){
                str1 = idx2 + "";
            }
            
            //绘制 
            if(str1 != ""){
                m_drawBoard.DrawSquare(x1, y1, m_BlockCellWidth);
                m_drawBoard.WriteText(str1, x1 + 0.18 * m_BlockCellWidth, y1 + 0.7 * m_BlockCellWidth, 0.65);
            }else{
                //绘制方格
                m_drawBoard.DrawSquare(x1, y1, m_BlockCellWidth, "grey", "dash");
            }
            
            x1 = x1 + m_BlockCellWidth;
        }
        y1 = y1 + m_BlockCellWidth;
        x1 = x0;
    }
}

//显示生成的题目图片，长按保存
function ShowImageDlg() {
    let dlgWidth = 350;
    let dlgHeight = 500;

    if (A4Direction == "w") {
        [dlgWidth, dlgHeight] = [350, 280];
    }

    let strImg = "<img ";
    strImg += "src=" + canvas.toDataURL('png', 1.0);
    strImg += " style='width:" + dlgWidth + "px;height:" + dlgHeight + "px;'></img>";
    let dlg1 = new Dialog({
        title: "长按图片，保存下载",
        text: strImg,
        cssdlg: "ttformsize"
    });

    dlg1.Show();
}