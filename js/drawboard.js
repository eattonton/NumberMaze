class CDrawBoard {
    constructor(ctx) {
        this.context2D = ctx;
        this.boardWidth = ctx.canvas.width;
        this.boardHeight = ctx.canvas.height;
    }
    ClearRect() {
        this.context2D.fillStyle = "white";
        this.context2D.fillRect(0, 0, this.boardWidth, this.boardHeight);
    }
    //绘制方格
    DrawSquare(x0, y0, width, strColor = "black", strStyle = "solid") {
        let linW = 0.04;
        let linScale = 60;
        this.DrawLine(x0, y0, x0 + width, y0, linW, linScale, strColor, strStyle);
        this.DrawLine(x0 + width, y0, x0 + width, y0 + width, linW, linScale, strColor, strStyle);
        this.DrawLine(x0 + width, y0 + width, x0, y0 + width, linW, linScale, strColor, strStyle);
        this.DrawLine(x0, y0 + width, x0, y0, linW, linScale, strColor, strStyle);
    }
    //绘制文本
    WriteText(str1, x, y, hei, scale) {
        scale = scale || 60;
        hei = hei * scale;
        let fontHei = hei + "px";
        this.context2D.font = "normal " + fontHei + " Arial";
        this.context2D.fillStyle = "#000000";
        let lines = str1.split('\n');
        for (let j = 0; j < lines.length; j++) {
            this.context2D.fillText(lines[j], x * scale, y * scale + (j * hei));
        }
    }
    //绘制直线
    DrawLine(x1, y1, x2, y2, wid = 0.04, scale = 60, strColor = "black", strStyle = "solid") {
        this.context2D.lineWidth = wid * scale;
        this.context2D.strokeStyle = strColor || "black";
        //开始一个新的绘制路径
        this.context2D.beginPath();
        if (strStyle == "dash") {
            this.context2D.setLineDash([0.1 * scale, 0.3 * scale]); // 设置虚线样式
            this.context2D.lineDashOffset = 0; // 设置虚线起始偏移量
        }
        else {
            this.context2D.setLineDash([]); // 设置实线样式
        }
        this.context2D.moveTo(x1 * scale, y1 * scale);
        this.context2D.lineTo(x2 * scale, y2 * scale);
        this.context2D.lineCap = "square";
        this.context2D.stroke();
        //关闭当前的绘制路径
        this.context2D.closePath();
    }
    //绘制圆
    DrawCircle(cx, cy, radius, wid, scale, strColor, strFill) {
        scale = scale || 60;
        wid = wid || 0.1;
        this.context2D.beginPath();
        this.context2D.setLineDash([]); // 设置实线样式
        this.context2D.lineWidth = wid * scale;
        this.context2D.strokeStyle = strColor || "black";
        this.context2D.arc(cx * scale, cy * scale, radius * scale, 0, 2 * Math.PI, false);
        this.context2D.stroke();
        if (strFill) {
            this.context2D.fillStyle = strFill || '#9fd9ef';
            this.context2D.fill();
        }
        //关闭当前的绘制路径
        this.context2D.closePath();
    }
    //绘制图片
    DrawImage(img0, cb, params) {
        let imgObj = new Image();
        imgObj.src = img0;
        imgObj.onload = () => {
            this.context2D.drawImage(imgObj, params[0], params[1], params[2], params[3]);
            if (typeof cb == "function") {
                cb();
            }
        };
    }
}
