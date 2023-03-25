class CDrawBoard {
    public context2D: CanvasRenderingContext2D;
    public boardWidth: number;
    public boardHeight: number;

    public constructor(ctx: CanvasRenderingContext2D) {
        this.context2D = ctx;
        this.boardWidth = ctx.canvas.width;
        this.boardHeight = ctx.canvas.height;
    }

    public ClearRect(): void {
        this.context2D.fillStyle = "white";
        this.context2D.fillRect(0, 0, this.boardWidth, this.boardHeight);
    }

    //绘制方格
    public DrawSquare(x0: number, y0: number, width: number, strColor: string = "black", strStyle: string = "solid"): void {
        let linW = 0.04;
        let linScale = 60;
        this.DrawLine(x0, y0, x0 + width, y0, linW, linScale, strColor, strStyle);
        this.DrawLine(x0 + width, y0, x0 + width, y0 + width, linW, linScale, strColor, strStyle);
        this.DrawLine(x0 + width, y0 + width, x0, y0 + width, linW, linScale, strColor, strStyle);
        this.DrawLine(x0, y0 + width, x0, y0, linW, linScale, strColor, strStyle);
    }

    //绘制文本
    public WriteText(str1: string, x: number, y: number, hei: number, scale: number): void {
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
    public DrawLine(x1: number, y1: number, x2: number, y2: number,
        wid: number = 0.04, scale: number = 60, strColor: string = "black", strStyle: string = "solid"): void {
        this.context2D.lineWidth = wid * scale;
        this.context2D.strokeStyle = strColor || "black";
        //开始一个新的绘制路径
        this.context2D.beginPath();
        if (strStyle == "dash") {
            this.context2D.setLineDash([0.1 * scale, 0.3 * scale]); // 设置虚线样式
            this.context2D.lineDashOffset = 0; // 设置虚线起始偏移量
        } else {
            this.context2D.setLineDash([]); // 设置实线样式
        }
        this.context2D.moveTo(x1 * scale, y1 * scale);
        this.context2D.lineTo(x2 * scale, y2 * scale);
        this.context2D.lineCap = "square"
        this.context2D.stroke();
        //关闭当前的绘制路径
        this.context2D.closePath();
    }

    //绘制圆
    public DrawCircle(cx: number, cy: number, radius: number, wid: number, scale: number, strColor: string, strFill: string): void {
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
    public DrawImage(img0: string, cb: any, params: any): void {
        let imgObj = new Image();
        imgObj.src = img0;
        imgObj.onload = () => {
            this.context2D.drawImage(imgObj, params[0], params[1], params[2], params[3]);
            if (typeof cb == "function") {
                cb();
            }
        }
    }
}