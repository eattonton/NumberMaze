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
    }else if (category == 5) {
        m_BlockCellWidth = 1.3;
        m_hard = 4;
        CreateOneBoxHaship(1.5, 7);
        CreateOneBoxHaship(11.5, 7);
        CreateOneBoxHaship(1.5, 18);
        CreateOneBoxHaship(11.5, 18);
    }else if (category == 6) {
        m_BlockCellWidth = 1.15;
        m_hard = 5;
        CreateOneBoxHaship(5.5, 4.5);
        CreateOneBoxHaship(5.5, 17);
    }else if (category == 7) {
        m_BlockCellWidth = 1.15;
        m_hard = 6;
        CreateOneBoxHaship(5.5, 4.5);
        CreateOneBoxHaship(5.5, 17);
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
    for (let y = 0; y < chess1.numRow-1; y++) {
        for (let x = 0; x < chess1.numCol-1; x++) {
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
            m_drawBoard.DrawCircle(dx1, dy1, m_BlockCellWidth * 0.2,0,0,"","white");
            m_drawBoard.DrawCircle(dx2, dy2, m_BlockCellWidth * 0.2,0,0,"","white");
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

//加载字典
function LoadDictionary(url, cb) {
    $.get(url, (e) => {
        if (e) {
            cb(e);
        }
    })
}