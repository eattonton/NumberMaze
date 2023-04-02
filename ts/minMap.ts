//单元
class Cell {
    public id: number;
    public id2: number;
    public tag: string;
    public x: number;
    public y: number;
    //放置点位置
    public x0: number;
    public y0: number;

    public constructor() {
        this.id = -1;
        this.id2 = -1;
        this.x = 0;
        this.y = 0;
        this.tag = "";
    }

    public Clone(): Cell {
        let c2 = { ...this };
        return c2;
    }
}

//棋盘的基础类
class CChessGridBase{
    public numRow: number = 5;
    public numCol: number = 5;
    public hard: number = 2;
    //二维数组
    public boxs: Array<Array<Cell>> = new Array<Array<Cell>>();

    public constructor() {

    }

    //根据序号获得坐标
    public GetRowColumn(idx: number): number[] {
        let res = [0, 0];

        res[0] = idx % this.numCol;
        res[1] = Math.floor(idx / this.numCol);

        return res;
    }

    //根据坐标获得序号
    public GetCellIndex(x: number, y: number): number {
        return this.numCol * y + x;
    }
}

//数字地雷
class CMineMap extends CChessGridBase{
    public numMine: number = 0;  //记录地雷数量
  
    public constructor() {
        super();
    }

    //创建棋盘数据
    public CreateChessData(hard: number): void {
        this.SetHard(hard);
        //2.创建地雷
        this.CreateMines();
        //3.计算周边的数值
        this.CalcNumber();
        //4.控制那些数值进行显示
        this.ShowNumber();
    }

    public SetHard(hard: number) {
        this.hard = hard;
        if (hard == 3) {
            this.numRow = 10;
            this.numCol = 10;
        } else if (hard == 4) {
            this.numRow = 14;
            this.numCol = 14;
        }
        for (let y = 0; y < this.numRow; y++) {
            this.boxs.push([]);
            for (let x = 0; x < this.numCol; x++) {
                this.boxs[y].push(new Cell());
                this.boxs[y][x].x = x;   //column
                this.boxs[y][x].y = y;   //row
            }
        }
    }

    //生成棋盘地雷
    public CreateMines(): void {
        for (let y = 0; y < this.numRow; y++) {
            //按照行随
            let arr1 = CArrayHelper.GetRandQueueInRange(this.hard, -1, this.numCol);
            for (let i = 0; i < arr1.length; i++) {
                if (this.AddMine(arr1[i], y)) {
                    this.numMine++;
                }
            }
        }
    }

    //设置单元格为地雷
    private AddMine(x: number, y: number): boolean {
        if (x >= 0 && x < this.numCol && y >= 0 && y < this.numRow) {
            this.boxs[y][x].tag = "m";
            return true;
        }

        return false;
    }

    //计算除地雷外的其它格的数量
    public CalcNumber(): void {
        for (let y = 0; y < this.numRow; y++) {
            for (let x = 0; x < this.numCol; x++) {
                let c1 = this.boxs[y][x];
                if (c1.tag != "m") {
                    //非雷区统计它周围的雷数量
                    let arr2 = this.GetNearCells(c1);
                    c1.id = 0;
                    for (let c2 of arr2) {
                        if (c2.tag == "m") {
                            c1.tag = 'n';
                            c1.id++;
                        }
                    }
                }
            }
        }
    }

    //获得附近的单元格
    private GetNearCells(c1: Cell): Array<Cell> {
        let arr1 = new Array<Cell>();

        let c2 = this.GetCell(c1.x - 1, c1.y - 1);
        if (c2 != null) arr1.push(c2);

        c2 = this.GetCell(c1.x - 1, c1.y);
        if (c2 != null) arr1.push(c2);

        c2 = this.GetCell(c1.x - 1, c1.y + 1);
        if (c2 != null) arr1.push(c2);

        c2 = this.GetCell(c1.x, c1.y - 1);
        if (c2 != null) arr1.push(c2);

        // c2 = this.GetCell(c1.x, c1.y);
        //if (c2 != null) arr1.push(c2);

        c2 = this.GetCell(c1.x, c1.y + 1);
        if (c2 != null) arr1.push(c2);

        c2 = this.GetCell(c1.x + 1, c1.y - 1);
        if (c2 != null) arr1.push(c2);

        c2 = this.GetCell(c1.x + 1, c1.y);
        if (c2 != null) arr1.push(c2);

        c2 = this.GetCell(c1.x + 1, c1.y + 1);
        if (c2 != null) arr1.push(c2);

        return arr1;
    }

    private GetNearCellsByTag(c1: Cell, tag: string): Array<Cell> {
        let arr1 = this.GetNearCells(c1);
        let arr2 = [];

        for (let c1 of arr1) {
            if (c1.tag == tag) {
                arr2.push(c1);
            }
        }

        return arr2;
    }

    private GetCell(x: number, y: number): Cell {
        if (x >= 0 && x < this.numCol && y >= 0 && y < this.numRow) {
            return this.boxs[y][x];
        }

        return null;
    }

    //判断是否显示
    public ShowNumber(): void {
        for (let y = 0; y < this.numRow; y++) {
            for (let x = 0; x < this.numCol; x++) {
                let c1 = this.boxs[y][x];
                if (c1.tag == "m") {
                    //雷区统计它周围的数量格
                    let arr2 = this.GetNearCellsByTag(c1, "n");
                    if (arr2.length >= 2) {
                        //生成随机的两位数组
                        let arr3 = CArrayHelper.GetRandQueueInRange(2, 0, arr2.length - 1);
                        for (let i2 of arr3) {
                            let c2 = arr2[i2];
                            this.boxs[c2.y][c2.x].id2 = 1;   //显示
                        }

                    }
                }
            }
        }
    }

    

}

//数字连桥路径
class CHashiPath {
    public items: Array<Cell> = new Array<Cell>();

    public get Count(): number {
        return this.items.length;
    }

    public constructor() {
    }

    public Add(c1: Cell): void {
        this.items.push(c1);
    }

    public GetAt(i: number): Cell {
        if (i >= 0 && i < this.items.length) {
            return this.items[i];
        }
        return null;
    }

    public IsPointOn(x: number, y: number): boolean{
        for (let i = 0; i < this.items.length - 1; i++) {
            let c1 = this.items[i];
            let d1 = this.items[i + 1];

            let x1 = x;
            let y1 = y;
            let x3 = c1.x;
            let y3 = c1.y;
            let x4 = d1.x;
            let y4 = d1.y;
            let d31 = this.getDistance(x3, y3, x1, y1);
            let d41 = this.getDistance(x4, y4, x1, y1);

            if (d31 == 0 || d41 == 0) {
             return true;
            }

        }
        return false;
    }

    //判断自己路径是否相交，要判断是否经过节点
    public Intersect(x: number, y: number, x2: number, y2: number): boolean {
        for (let i = 0; i < this.items.length - 1; i++) {
            let c1 = this.items[i];
            let d1 = this.items[i + 1];

            let b1 = this.isIntersecting([x, y], [x2, y2], [c1.x, c1.y], [d1.x, d1.y]);
            let b2 = this.isIntersecting2([x, y], [x2, y2], [c1.x, c1.y], [d1.x, d1.y]);
            let b3 = this.isIntersecting3([x, y], [x2, y2], [c1.x, c1.y], [d1.x, d1.y]);
            //console.log([x, y], [x2, y2], [c1.x, c1.y], [d1.x, d1.y], b1, b2, b3)
            if (b1 || b2 || b3) {
                return true;
            }
        }

        return false;
    }

    //与其他路径进行相交判断，不用判断是否经过节点
    public IntersectOther(x: number, y: number, x2: number, y2: number): boolean {
        for (let i = 0; i < this.items.length - 1; i++) {
            let c1 = this.items[i];
            let d1 = this.items[i + 1];

            let b1 = this.isIntersecting([x, y], [x2, y2], [c1.x, c1.y], [d1.x, d1.y]);
            let b2 = this.isIntersecting2([x, y], [x2, y2], [c1.x, c1.y], [d1.x, d1.y]);
            let b3 = this.isIntersecting3([x, y], [x2, y2], [c1.x, c1.y], [d1.x, d1.y]);
            //console.log([x, y], [x2, y2], [c1.x, c1.y], [d1.x, d1.y], b1, b2, b3)
            if (b2 || b3) {
                return true;
            }
        }

        return false;
    }

    private getDistance(x1: number, y1: number, x2: number, y2: number): number {
        let d0 = Math.sqrt((x1 - x2) * ((x1 - x2)) + (y1 - y2) * (y1 - y2));
        return d0;
    }

    //判断点是否重合 包含两点
    private isIntersecting(A: Array<number>, B: Array<number>, C: Array<number>, D: Array<number>): boolean {
        let x2: number = B[0];
        let y2: number = B[1];
        let x3: number = C[0];
        let y3: number = C[1];
        let x4: number = D[0];
        let y4: number = D[1];

        let d32 = this.getDistance(x3, y3, x2, y2);
        let d42 = this.getDistance(x4, y4, x2, y2);

        if (d32 == 0 || d42 == 0) {
            return true;
        }

        return false;
    }

    //路径不能重合 判断B(X2,Y2) 是否在存在的线段上
    //判断点是否重合 不包含两点
    private isIntersecting2(A: Array<number>, B: Array<number>, C: Array<number>, D: Array<number>): boolean {
        let x1: number = A[0];
        let y1: number = A[1];
        let x2: number = B[0];
        let y2: number = B[1];
        let x3: number = C[0];
        let y3: number = C[1];
        let x4: number = D[0];
        let y4: number = D[1];

        //判断是否共线
        let d31 = this.getDistance(x3, y3, x1, y1);
        let d41 = this.getDistance(x4, y4, x1, y1);
        let d32 = this.getDistance(x3, y3, x2, y2);
        let d42 = this.getDistance(x4, y4, x2, y2);
        let d12 = this.getDistance(x1, y1, x2, y2);
        let d34 = this.getDistance(x3, y3, x4, y4);

        if (d32 > 0 && d42 > 0 && d32 + d42 == d34) {
            return true;
        }else if(d31 > 0 && d32 > 0 && d31 + d32 == d12){
            return true;
        }else if(d41 > 0 && d42 > 0 && d41 + d42 == d12){
            return true;
        }

        return false;
    }

    //路径不能相交
    private isIntersecting3(A: Array<number>, B: Array<number>, C: Array<number>, D: Array<number>): boolean {
        let x1: number = A[0];
        let y1: number = A[1];
        let x2: number = B[0];
        let y2: number = B[1];
        let x3: number = C[0];
        let y3: number = C[1];
        let x4: number = D[0];
        let y4: number = D[1];

        if (y3 == y4) {
            let d31 = Math.abs(x3 - x1);
            let d41 = Math.abs(x4 - x1);
            let d34 = Math.abs(x3 - x4);
            let d32 = Math.abs(x3 - x2);
            let d42 = Math.abs(x4 - x2);
            if (x1 == x2) {
                //水平 vs 竖直
                if (d31 > 0 && d41 > 0 && (d31 + d41) == d34) {
                    if (y1 <= y3 && y3 <= y2) {
                        return true;
                    } else if (y2 <= y3 && y3 <= y1) {
                        return true;
                    }
                }
            }
        } else if (x3 == x4) {
            let d31 = Math.abs(y3 - y1);
            let d41 = Math.abs(y4 - y1);
            let d34 = Math.abs(y3 - y4);
            let d32 = Math.abs(y3 - y2);
            let d42 = Math.abs(y4 - y2);
            if (y1 == y2) {
                //竖直 vs 水平 
                if (d31 > 0 && d41 > 0 && (d31 + d41) == d34) {
                    if (x1 <= x3 && x3 <= x2) {
                        return true;
                    } else if (x2 <= x3 && x3 <= x1) {
                        return true;
                    }
                }
            }  
        }

        return false;
    }

    //设置节点所关联的桥数量
    public SetBridgeNumber():void{
        for (let i = 0; i < this.items.length-1; i++) {
            let c1 = this.items[i];
            let c2 = this.items[i+1];
            let n1 = CArrayHelper.RandomInt(1,2);
            if(c1.id < 0){
                c1.id = n1;
            }else{
                c1.id += n1;
            }
            if(c2.id < 0){
                c2.id = n1;
            }else{
                c2.id += n1;
            }
        }
    }
}

//数字连桥
class CHashiMap extends CChessGridBase{
    //记录路径
    public paths: Array<CHashiPath> = new Array<CHashiPath>();

    public get CountPath(): number {
        return this.paths.length;
    }

    public constructor() {
       super();
    }

    //创建棋盘数据
    public CreateChessData(hard: number): void {
        this.SetHard(hard);
        //生成地条路线
        this.StartStep();
        //生成直线路径
        this.OtherStep(4);
        if(this.hard >= 5){
            this.OtherStep(4);
        }
        if(this.hard >= 6){
            this.OtherStep(4);
        }
        if(this.hard >= 7){
            this.OtherStep(4);
        }
        if(this.hard >= 8){
            this.OtherStep(4);
        }
        //计算桥
        this.SetBridges();
    }

    public SetHard(hard: number) {
        if (hard == 3) {
            //入门
            this.hard = 3;
            this.numRow = 5;
            this.numCol = 5;
        }else if (hard == 4) {
            //简单
            this.hard = 5;
            this.numRow = 7;
            this.numCol = 7;
        }else if (hard == 5) {
            //中等
            this.hard = 6;
            this.numRow = 10;
            this.numCol = 10;
        }else if (hard == 6) {
            //困难
            this.hard = 8;
            this.numRow = 10;
            this.numCol = 10;
        }
        for (let y = 0; y < this.numRow; y++) {
            this.boxs.push([]);
            for (let x = 0; x < this.numCol; x++) {
                this.boxs[y].push(new Cell());
                this.boxs[y][x].x = x;   //column
                this.boxs[y][x].y = y;   //row
            }
        }
    }

    //创建第一条路径
    public StartStep() {
        this.paths.push(new CHashiPath());
        //1.随机生成位置
        let x = CArrayHelper.RandomInt(0, this.numCol - 1);
        let y = CArrayHelper.RandomInt(0, this.numRow - 1);
        //2.记录当前位置到路径
        this.paths[this.paths.length - 1].Add(this.boxs[y][x]);
        //3.计算下一步
        this.NextStep(x, y, 2);
    }
    //创建其他路径
    public OtherStep(n:number) {
        //1.随机选择一个路径
        let iP = CArrayHelper.RandomInt(0, this.CountPath - 1);
        //2.随机选择路径上的一个节点作为起始位置
        let iN = CArrayHelper.RandomInt(1, this.paths[iP].Count - 2);
        //3.
        let oNd = this.paths[iP].GetAt(iN);
        this.paths.push(new CHashiPath());
        let x = oNd.x;
        let y = oNd.y;
        //2.记录当前位置到路径
        this.paths[this.paths.length - 1].Add(this.boxs[y][x]);
        //3.计算下一步
        this.NextStep(x, y, 8);
        if(this.paths[this.paths.length - 1].Count <= 1){
            this.paths.splice(this.paths.length-1,1);
            if(n>=0){
                this.OtherStep(--n);
            }
            
        }
    }

    //计算下一步
    public NextStep(x: number, y: number, n: number): void {
        //1.获得可能存在的下一步
        let pos2 = this.FindNext(x, y);
        let x2 = 0;
        let y2 = 0;
        if (pos2 == null) {
            //没找到
            --n;
            x2 = x;
            y2 = y;
        } else {
            x2 = pos2[0];
            y2 = pos2[1];
            this.paths[this.paths.length - 1].Add(this.boxs[y2][x2]);
        }
        //console.log(pos2);
 
        if (n >= 0 && this.paths[this.paths.length - 1].Count <= this.hard) {
            this.NextStep(x2, y2, n);
        }
    }

    //返回可能的下个位置
    private FindNext(x: number, y: number): number[] {
        let arr1 = CArrayHelper.GetRandQueueInRange(4, 0, 3);
        let arr2 = [x, y];
        let bfind = false;
        for (let i = 0; i < arr1.length; i++) {
            let j = arr1[i];
            arr2 = [x, y];
            if (j == 0) {
                let x2 = this.RandomLeft(x);
                if (x2 >= 0) {
                    arr2[0] = x2;
                    //break;
                }
            } else if (j == 1) {
                let x2 = this.RandomRight(x);
                if (x2 >= 0) {
                    arr2[0] = x2;
                    //break;
                }
            } else if (j == 2) {
                let y2 = this.RandomDown(y);
                if (y2 >= 0) {
                    arr2[1] = y2;
                    // break;
                }
            } else if (j == 3) {
                let y2 = this.RandomUp(y);
                if (y2 >= 0) {
                    arr2[1] = y2;
                    //break;
                }
            }

            if (this.ValidNext(x, y, arr2[0], arr2[1])) {
                bfind = true;
                break;
            }
        }

        if (!bfind) return null;
        return arr2;
    }

    //-X 方向的随机数
    private RandomLeft(x: number): number {
        if (x > 0) {
            return CArrayHelper.RandomInt(0, x - 1);
        }
        return -1;
    }

    private RandomRight(x: number): number {
        if (x < this.numCol - 1) {
            return CArrayHelper.RandomInt(x + 1, this.numCol - 1);
        }
        return -1;
    }

    private RandomDown(y: number): number {
        if (y > 0) {
            return CArrayHelper.RandomInt(0, y - 1);
        }
        return -1;
    }

    private RandomUp(y: number): number {
        if (y < this.numRow - 1) {
            return CArrayHelper.RandomInt(y + 1, this.numRow - 1);
        }
        return -1;
    }

    //检查是否为有效点
    private ValidNext(x: number, y: number, x2: number, y2: number): boolean {
        //1.判断长度0 为无效
        let d0 = Math.sqrt((x - x2) * ((x - x2)) + (y - y2) * (y - y2));
        if (d0 == 0) return false;
        //2.判断是不是与现有的路径重合
        for (let i = 0; i < this.paths.length; i++) {
            let p1 = this.paths[i];
            if (p1.IsPointOn(x, y)) {
                if (p1.Intersect(x, y, x2, y2)) {
                    return false;
                }
            } else {
                //与其他路径判断，不用判断是否包含节点
                if (p1.IntersectOther(x, y, x2, y2)) {
                    return false;
                }
            }

        }

        return true;
    }

    //设置棋盘中的桥
    public SetBridges():void{
        for (let i = 0; i < this.paths.length; i++) {
            let p1 = this.paths[i];
            p1.SetBridgeNumber();
        }
    }
}


//舒尔特方格
class CSchulteGrid extends CChessGridBase{
     
    public constructor() {
       super();
    }

    public SetHard(hard: number) {
        this.hard = hard;
        if (hard == 2) {
            this.numRow = 7;
            this.numCol = 7;
        }  
        for (let y = 0; y < this.numRow; y++) {
            this.boxs.push([]);
            for (let x = 0; x < this.numCol; x++) {
                this.boxs[y].push(new Cell());
                this.boxs[y][x].x = x;   //column
                this.boxs[y][x].y = y;   //row
            }
        }

        this.CreateCells();
    }

    public CreateCells(): void {
        let num = this.numRow*this.numCol;
        let arr1 = CArrayHelper.GetRandQueueInRange(num, 1, num);
        //随机生成不需要显示的数
        let arr2 = CArrayHelper.GetRandQueueInRange(this.hard, 1, num);
        for (let y = 0; y < this.numRow; y++) {
            for (let x = 0; x < this.numCol; x++) {
                this.boxs[y][x].id = arr1[super.GetCellIndex(x,y)];   
                if(arr2.indexOf(this.boxs[y][x].id) >= 0){
                    this.boxs[y][x].id = -1;
                }
            }
        }
       
    }

}


//数方
