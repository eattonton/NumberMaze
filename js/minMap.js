var CellDirection;
(function (CellDirection) {
    CellDirection[CellDirection["up"] = 0] = "up";
    CellDirection[CellDirection["down"] = 1] = "down";
    CellDirection[CellDirection["left"] = 2] = "left";
    CellDirection[CellDirection["right"] = 3] = "right";
})(CellDirection || (CellDirection = {}));
//单元
class Cell {
    constructor() {
        this.id = -1;
        this.id2 = -1;
        this.x = 0;
        this.y = 0;
        this.tag = "";
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.show = false;
    }
    get CountEdge() {
        let ires = 0;
        if (this.up)
            ++ires;
        if (this.down)
            ++ires;
        if (this.left)
            ++ires;
        if (this.right)
            ++ires;
        return ires;
    }
    Clone() {
        let c2 = Object.assign({}, this);
        return c2;
    }
}
//棋盘的基础类
class CChessGridBase {
    constructor() {
        this.numRow = 5;
        this.numCol = 5;
        this.hard = 2;
        //二维数组
        this.boxs = new Array();
    }
    //根据序号获得坐标
    GetRowColumn(idx) {
        let res = [0, 0];
        res[0] = idx % this.numCol;
        res[1] = Math.floor(idx / this.numCol);
        return res;
    }
    //根据坐标获得序号
    GetCellIndex(x, y) {
        return this.numCol * y + x;
    }
}
//数字地雷
class CMineMap extends CChessGridBase {
    constructor() {
        super();
        this.numMine = 0; //记录地雷数量
    }
    //创建棋盘数据
    CreateChessData(hard) {
        this.SetHard(hard);
        //2.创建地雷
        this.CreateMines();
        //3.计算周边的数值
        this.CalcNumber();
        //4.控制那些数值进行显示
        this.ShowNumber();
    }
    SetHard(hard) {
        this.hard = hard;
        if (hard == 3) {
            this.numRow = 10;
            this.numCol = 10;
        }
        else if (hard == 4) {
            this.numRow = 14;
            this.numCol = 14;
        }
        for (let y = 0; y < this.numRow; y++) {
            this.boxs.push([]);
            for (let x = 0; x < this.numCol; x++) {
                this.boxs[y].push(new Cell());
                this.boxs[y][x].x = x; //column
                this.boxs[y][x].y = y; //row
            }
        }
    }
    //生成棋盘地雷
    CreateMines() {
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
    AddMine(x, y) {
        if (x >= 0 && x < this.numCol && y >= 0 && y < this.numRow) {
            this.boxs[y][x].tag = "m";
            return true;
        }
        return false;
    }
    //计算除地雷外的其它格的数量
    CalcNumber() {
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
    GetNearCells(c1) {
        let arr1 = new Array();
        let c2 = this.GetCell(c1.x - 1, c1.y - 1);
        if (c2 != null)
            arr1.push(c2);
        c2 = this.GetCell(c1.x - 1, c1.y);
        if (c2 != null)
            arr1.push(c2);
        c2 = this.GetCell(c1.x - 1, c1.y + 1);
        if (c2 != null)
            arr1.push(c2);
        c2 = this.GetCell(c1.x, c1.y - 1);
        if (c2 != null)
            arr1.push(c2);
        // c2 = this.GetCell(c1.x, c1.y);
        //if (c2 != null) arr1.push(c2);
        c2 = this.GetCell(c1.x, c1.y + 1);
        if (c2 != null)
            arr1.push(c2);
        c2 = this.GetCell(c1.x + 1, c1.y - 1);
        if (c2 != null)
            arr1.push(c2);
        c2 = this.GetCell(c1.x + 1, c1.y);
        if (c2 != null)
            arr1.push(c2);
        c2 = this.GetCell(c1.x + 1, c1.y + 1);
        if (c2 != null)
            arr1.push(c2);
        return arr1;
    }
    GetNearCellsByTag(c1, tag) {
        let arr1 = this.GetNearCells(c1);
        let arr2 = [];
        for (let c1 of arr1) {
            if (c1.tag == tag) {
                arr2.push(c1);
            }
        }
        return arr2;
    }
    GetCell(x, y) {
        if (x >= 0 && x < this.numCol && y >= 0 && y < this.numRow) {
            return this.boxs[y][x];
        }
        return null;
    }
    //判断是否显示
    ShowNumber() {
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
                            this.boxs[c2.y][c2.x].id2 = 1; //显示
                        }
                    }
                }
            }
        }
    }
}
//数字连桥路径
class CHashiPath {
    get Count() {
        return this.items.length;
    }
    constructor() {
        this.items = new Array();
    }
    Add(c1) {
        this.items.push(c1);
    }
    GetAt(i) {
        if (i >= 0 && i < this.items.length) {
            return this.items[i];
        }
        return null;
    }
    IsPointOn(x, y) {
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
    Intersect(x, y, x2, y2) {
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
    IntersectOther(x, y, x2, y2) {
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
    getDistance(x1, y1, x2, y2) {
        let d0 = Math.sqrt((x1 - x2) * ((x1 - x2)) + (y1 - y2) * (y1 - y2));
        return d0;
    }
    //判断点是否重合 包含两点
    isIntersecting(A, B, C, D) {
        let x2 = B[0];
        let y2 = B[1];
        let x3 = C[0];
        let y3 = C[1];
        let x4 = D[0];
        let y4 = D[1];
        let d32 = this.getDistance(x3, y3, x2, y2);
        let d42 = this.getDistance(x4, y4, x2, y2);
        if (d32 == 0 || d42 == 0) {
            return true;
        }
        return false;
    }
    //路径不能重合 判断B(X2,Y2) 是否在存在的线段上
    //判断点是否重合 不包含两点
    isIntersecting2(A, B, C, D) {
        let x1 = A[0];
        let y1 = A[1];
        let x2 = B[0];
        let y2 = B[1];
        let x3 = C[0];
        let y3 = C[1];
        let x4 = D[0];
        let y4 = D[1];
        //判断是否共线
        let d31 = this.getDistance(x3, y3, x1, y1);
        let d41 = this.getDistance(x4, y4, x1, y1);
        let d32 = this.getDistance(x3, y3, x2, y2);
        let d42 = this.getDistance(x4, y4, x2, y2);
        let d12 = this.getDistance(x1, y1, x2, y2);
        let d34 = this.getDistance(x3, y3, x4, y4);
        if (d32 > 0 && d42 > 0 && d32 + d42 == d34) {
            return true;
        }
        else if (d31 > 0 && d32 > 0 && d31 + d32 == d12) {
            return true;
        }
        else if (d41 > 0 && d42 > 0 && d41 + d42 == d12) {
            return true;
        }
        return false;
    }
    //路径不能相交
    isIntersecting3(A, B, C, D) {
        let x1 = A[0];
        let y1 = A[1];
        let x2 = B[0];
        let y2 = B[1];
        let x3 = C[0];
        let y3 = C[1];
        let x4 = D[0];
        let y4 = D[1];
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
                    }
                    else if (y2 <= y3 && y3 <= y1) {
                        return true;
                    }
                }
            }
        }
        else if (x3 == x4) {
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
                    }
                    else if (x2 <= x3 && x3 <= x1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    //设置节点所关联的桥数量
    SetBridgeNumber() {
        for (let i = 0; i < this.items.length - 1; i++) {
            let c1 = this.items[i];
            let c2 = this.items[i + 1];
            let n1 = CArrayHelper.RandomInt(1, 2);
            if (c1.id < 0) {
                c1.id = n1;
            }
            else {
                c1.id += n1;
            }
            if (c2.id < 0) {
                c2.id = n1;
            }
            else {
                c2.id += n1;
            }
        }
    }
}
//数字连桥
class CHashiMap extends CChessGridBase {
    get CountPath() {
        return this.paths.length;
    }
    constructor() {
        super();
        //记录路径
        this.paths = new Array();
    }
    //创建棋盘数据
    CreateChessData(hard) {
        this.SetHard(hard);
        //生成地条路线
        this.StartStep();
        //生成直线路径
        this.OtherStep(4);
        if (this.hard >= 5) {
            this.OtherStep(4);
        }
        if (this.hard >= 6) {
            this.OtherStep(4);
        }
        if (this.hard >= 7) {
            this.OtherStep(4);
        }
        if (this.hard >= 8) {
            this.OtherStep(4);
        }
        //计算桥
        this.SetBridges();
    }
    SetHard(hard) {
        if (hard == 3) {
            //入门
            this.hard = 3;
            this.numRow = 5;
            this.numCol = 5;
        }
        else if (hard == 4) {
            //简单
            this.hard = 5;
            this.numRow = 7;
            this.numCol = 7;
        }
        else if (hard == 5) {
            //中等
            this.hard = 6;
            this.numRow = 10;
            this.numCol = 10;
        }
        else if (hard == 6) {
            //困难
            this.hard = 8;
            this.numRow = 10;
            this.numCol = 10;
        }
        for (let y = 0; y < this.numRow; y++) {
            this.boxs.push([]);
            for (let x = 0; x < this.numCol; x++) {
                this.boxs[y].push(new Cell());
                this.boxs[y][x].x = x; //column
                this.boxs[y][x].y = y; //row
            }
        }
    }
    //创建第一条路径
    StartStep() {
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
    OtherStep(n) {
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
        if (this.paths[this.paths.length - 1].Count <= 1) {
            this.paths.splice(this.paths.length - 1, 1);
            if (n >= 0) {
                this.OtherStep(--n);
            }
        }
    }
    //计算下一步
    NextStep(x, y, n) {
        //1.获得可能存在的下一步
        let pos2 = this.FindNext(x, y);
        let x2 = 0;
        let y2 = 0;
        if (pos2 == null) {
            //没找到
            --n;
            x2 = x;
            y2 = y;
        }
        else {
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
    FindNext(x, y) {
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
            }
            else if (j == 1) {
                let x2 = this.RandomRight(x);
                if (x2 >= 0) {
                    arr2[0] = x2;
                    //break;
                }
            }
            else if (j == 2) {
                let y2 = this.RandomDown(y);
                if (y2 >= 0) {
                    arr2[1] = y2;
                    // break;
                }
            }
            else if (j == 3) {
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
        if (!bfind)
            return null;
        return arr2;
    }
    //-X 方向的随机数
    RandomLeft(x) {
        if (x > 0) {
            return CArrayHelper.RandomInt(0, x - 1);
        }
        return -1;
    }
    RandomRight(x) {
        if (x < this.numCol - 1) {
            return CArrayHelper.RandomInt(x + 1, this.numCol - 1);
        }
        return -1;
    }
    RandomDown(y) {
        if (y > 0) {
            return CArrayHelper.RandomInt(0, y - 1);
        }
        return -1;
    }
    RandomUp(y) {
        if (y < this.numRow - 1) {
            return CArrayHelper.RandomInt(y + 1, this.numRow - 1);
        }
        return -1;
    }
    //检查是否为有效点
    ValidNext(x, y, x2, y2) {
        //1.判断长度0 为无效
        let d0 = Math.sqrt((x - x2) * ((x - x2)) + (y - y2) * (y - y2));
        if (d0 == 0)
            return false;
        //2.判断是不是与现有的路径重合
        for (let i = 0; i < this.paths.length; i++) {
            let p1 = this.paths[i];
            if (p1.IsPointOn(x, y)) {
                if (p1.Intersect(x, y, x2, y2)) {
                    return false;
                }
            }
            else {
                //与其他路径判断，不用判断是否包含节点
                if (p1.IntersectOther(x, y, x2, y2)) {
                    return false;
                }
            }
        }
        return true;
    }
    //设置棋盘中的桥
    SetBridges() {
        for (let i = 0; i < this.paths.length; i++) {
            let p1 = this.paths[i];
            p1.SetBridgeNumber();
        }
    }
}
//舒尔特方格
class CSchulteGrid extends CChessGridBase {
    constructor() {
        super();
    }
    SetHard(hard) {
        this.hard = hard;
        if (hard == 2) {
            this.numRow = 7;
            this.numCol = 7;
        }
        for (let y = 0; y < this.numRow; y++) {
            this.boxs.push([]);
            for (let x = 0; x < this.numCol; x++) {
                this.boxs[y].push(new Cell());
                this.boxs[y][x].x = x; //column
                this.boxs[y][x].y = y; //row
            }
        }
        this.CreateCells();
    }
    CreateCells() {
        let num = this.numRow * this.numCol;
        let arr1 = CArrayHelper.GetRandQueueInRange(num, 1, num);
        //随机生成不需要显示的数
        let arr2 = CArrayHelper.GetRandQueueInRange(this.hard, 1, num);
        for (let y = 0; y < this.numRow; y++) {
            for (let x = 0; x < this.numCol; x++) {
                this.boxs[y][x].id = arr1[super.GetCellIndex(x, y)];
                if (arr2.indexOf(this.boxs[y][x].id) >= 0) {
                    this.boxs[y][x].id = -1;
                }
            }
        }
    }
}
//数方
class CShiKaKuGrid extends CChessGridBase {
    constructor() {
        super();
        this.chessParts = new Array();
        this.chessRanges = new Array();
        for (let y = 0; y < this.numRow; y++) {
            this.boxs.push([]);
            for (let x = 0; x < this.numCol; x++) {
                this.boxs[y].push(new Cell());
                this.boxs[y][x].x = x; //column
                this.boxs[y][x].y = y; //row
            }
        }
    }
    SetHard(hard) {
        this.hard = hard;
        let splitNumber = 5;
        if (this.hard == 3) {
            this.numCol = 7;
            this.numRow = 7;
        }
        else if (this.hard >= 4) {
            this.numCol = 12;
            this.numRow = 12;
            splitNumber = 7;
        }
        this.CreateChessDataWithSplit(splitNumber);
    }
    CreateChessDataWithSplit(splitNum) {
        //1.定义范围
        let rang1 = new CRange(0, 0, this.numCol - 1, this.numRow - 1);
        //2.分割范围
        this.SplitChess(rang1, splitNum);
        //3.赋值id
        for (let i = 0; i < this.chessRanges.length; i++) {
            this.chessRanges[i].id = i + 1;
        }
        if (this.hard == 1)
            return;
        //4.随机合并范围
        for (let i = 0; i < this.chessRanges.length; i++) {
            let rang3 = null;
            let rang1 = this.chessRanges[i];
            let i2 = rang1.FindConnectedBlock(this.chessRanges, rang3);
            if (i2 >= 0 && rang3 != null) {
                //找到合并的对象
                rang3.id = rang1.id;
                this.chessRanges[i] = rang3;
                this.chessRanges.splice(i2, 1);
                console.log(rang3);
            }
        }
        // console.log(this.chessRanges);
    }
    //按照范围分割范围
    SplitChess(rang1, n) {
        if (n <= 0) {
            this.chessRanges.push(rang1);
        }
        else {
            let arr1 = rang1.SplitAlong();
            for (let rang2 of arr1) {
                this.SplitChess(rang2, n - 1);
            }
        }
    }
    GetRangeByPosition(x0, y0) {
        for (let i = 0; i < this.chessRanges.length; i++) {
            if (this.chessRanges[i].CheckIn(x0, y0)) {
                return this.chessRanges[i];
            }
        }
        return null;
    }
    //通过放入part生成棋盘数据
    CreateChessDataWithPart() {
        //2.生成一个随机数组
        let partIdx = [0, 1, 2];
        for (let i = 0; i < 64; i++) {
            let partIdx2 = CArrayHelper.GetRandQueue(partIdx, partIdx.length);
            //let partIdx2 =[3,4];
            for (let j = 0; j < partIdx2.length; j++) {
                //3.获得一个part
                let part0 = CPartFactory.GetPart(partIdx2[j]);
                part0.id = this.chessParts.length;
                //4.指定位置填充
                let arrPos = this.GetEmptyPosition();
                let chessPosX = arrPos[0];
                let chessPosY = arrPos[1];
                if (this.insertPart(part0, chessPosX, chessPosY)) {
                    //判断是否存在无效的空格
                    if (this.CheckInvalidCell()) {
                        this.removePart(part0, chessPosX, chessPosY);
                    }
                    else {
                        part0.x0 = chessPosX;
                        part0.y0 = chessPosY;
                        this.chessParts.push(part0);
                        //只要能插入 就进入下一个
                        break;
                    }
                }
            }
        }
        //检查是否还有空格
        if (this.ExistEmptyPosition()) {
            //  return this.CreateChessData();
        }
    }
    //row = y, column = x插入零件 
    insertPart(p1, c, r) {
        let x = c;
        let y = r;
        //1.判断是否能够插入
        for (let i = 0; i < p1.Count; i++) {
            let cell1 = p1.items[i];
            //填充到指定位置的格子
            let x2 = x + cell1.x;
            let y2 = y + cell1.y;
            if (x2 < 0 || x2 >= this.numCol)
                return false;
            if (y2 < 0 || y2 >= this.numRow)
                return false;
            if (this.boxs[y2][x2].id >= 0)
                return false;
        }
        //2.修改指定位置的id值
        for (let i = 0; i < p1.Count; i++) {
            let cell1 = p1.items[i];
            //填充到指定位置的格子
            let x2 = x + cell1.x;
            let y2 = y + cell1.y;
            this.boxs[y2][x2].id = p1.id;
            this.boxs[y2][x2].id2 = cell1.id2;
        }
        return true;
    }
    //去掉添加的零件
    removePart(p1, c, r) {
        let x = c;
        if (x == undefined)
            x = p1.x0;
        let y = r;
        if (y == undefined)
            y = p1.y0;
        for (let i = 0; i < p1.Count; i++) {
            let cell1 = p1.items[i];
            //填充到指定位置的格子
            let x2 = x + cell1.x;
            let y2 = y + cell1.y;
            this.boxs[y2][x2].id = -1;
        }
    }
    //获得可以插入的位置
    GetEmptyPosition() {
        for (let y = 0; y < this.numRow; y++) {
            for (let x = 0; x < this.numCol; x++) {
                if (this.boxs[y][x].id == -1) {
                    return [x, y];
                }
            }
        }
        return [0, 0];
    }
    //获得在X方向上空格的位置
    GetEmptyEndX(x0, y0) {
        let iRes = -1;
        if (y0 >= 0 && y0 < this.numRow) {
            for (let x = x0; x < this.numCol; x++) {
                if (this.boxs[y0][x].id != -1) {
                    break;
                }
                iRes = x;
            }
        }
        return iRes;
    }
    //获得在y方向上空格的位置
    GetEmptyEndY(x0, y0) {
        let iRes = -1;
        if (x0 >= 0 && x0 < this.numCol) {
            for (let y = y0; y < this.numRow; y++) {
                if (this.boxs[y][x0].id != -1) {
                    break;
                }
                iRes = y;
            }
        }
        return iRes;
    }
    //判断是否存在空格
    ExistEmptyPosition() {
        for (let y = 0; y < this.numRow; y++) {
            for (let x = 0; x < this.numCol; x++) {
                if (this.boxs[y][x].id == -1) {
                    return true;
                }
            }
        }
        return false;
    }
    //判断是否存在无效的空格
    CheckInvalidCell() {
        for (let y = 0; y < this.numRow; y++) {
            for (let x = 0; x < this.numCol; x++) {
                if (this.boxs[y][x].id == -1) {
                    let arr1 = this.GetNearEmptyCells(x, y);
                    if (arr1.length == 0) {
                        //存在无效的单个格子
                        return true;
                    }
                    else if (arr1.length == 1) {
                        let xy2 = this.GetRowColumn(arr1[0]);
                        let arr2 = this.GetNearEmptyCells(xy2[0], xy2[1]);
                        let pos1 = this.GetCellIndex(x, y);
                        if (arr2.length == 1 && arr2[0] == pos1) {
                            //连续连个格式封闭
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    GetNearEmptyCells(x, y) {
        let arr1 = [];
        //判断是否存在无效空格 四周不存在 -1
        let pt1 = this.GetPosUp(x, y);
        if (pt1.length >= 2 && this.boxs[pt1[1]][pt1[0]].id == -1) {
            arr1.push(this.GetCellIndex(pt1[0], pt1[1]));
        }
        pt1 = this.GetPosDown(x, y);
        if (pt1.length >= 2 && this.boxs[pt1[1]][pt1[0]].id == -1) {
            arr1.push(this.GetCellIndex(pt1[0], pt1[1]));
        }
        pt1 = this.GetPosRight(x, y);
        if (pt1.length >= 2 && this.boxs[pt1[1]][pt1[0]].id == -1) {
            arr1.push(this.GetCellIndex(pt1[0], pt1[1]));
        }
        pt1 = this.GetPosLeft(x, y);
        if (pt1.length >= 2 && this.boxs[pt1[1]][pt1[0]].id == -1) {
            arr1.push(this.GetCellIndex(pt1[0], pt1[1]));
        }
        return arr1;
    }
    GetPosUp(x, y) {
        if (y + 1 < this.numRow) {
            return [x, y + 1];
        }
        return [];
    }
    GetPosDown(x, y) {
        if (y - 1 >= 0) {
            return [x, y - 1];
        }
        return [];
    }
    GetPosRight(x, y) {
        if (x + 1 < this.numCol) {
            return [x + 1, y];
        }
        return [];
    }
    GetPosLeft(x, y) {
        if (x - 1 >= 0) {
            return [x - 1, y];
        }
        return [];
    }
}
//矩形范围的表示
class CRange {
    get Count() {
        let d1 = Math.abs(this.x2 - this.x1) + 1;
        let d2 = Math.abs(this.y2 - this.y1) + 1;
        return d1 * d2;
    }
    constructor(x1, y1, x2, y2) {
        this.id = -1;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    SplitAlong() {
        let arr1 = new Array();
        let idx = CArrayHelper.RandomInt(0, 1);
        let idx2 = [idx, 1 - idx];
        for (let i of idx2) {
            if (i == 0) {
                arr1 = this.SplitAlongX();
                if (arr1.length > 0) {
                    break;
                }
            }
            else if (i == 1) {
                arr1 = this.SplitAlongY();
                if (arr1.length > 0) {
                    break;
                }
            }
        }
        if (arr1.length == 0) {
            arr1.push(new CRange(this.x1, this.y1, this.x2, this.y2));
        }
        return arr1;
    }
    //沿X方向进行分割
    SplitAlongX() {
        let arr1 = new Array();
        if (this.x1 < this.x2) {
            if ((this.x2 - this.x1) == 1) {
                let rang1 = new CRange(this.x1, this.y1, this.x1, this.y2);
                let rang2 = new CRange(this.x2, this.y1, this.x2, this.y2);
                if (CRange.CheckValid(rang1) && CRange.CheckValid(rang2)) {
                    arr1.push(rang1);
                    arr1.push(rang2);
                }
            }
            else {
                let splitx = CArrayHelper.RandomInt(this.x1, this.x2 - 1);
                let rang1 = new CRange(this.x1, this.y1, splitx, this.y2);
                let rang2 = new CRange(splitx + 1, this.y1, this.x2, this.y2);
                if (CRange.CheckValid(rang1) && CRange.CheckValid(rang2)) {
                    arr1.push(rang1);
                    arr1.push(rang2);
                }
            }
        }
        return arr1;
    }
    //沿Y方向进行分割
    SplitAlongY() {
        let arr1 = new Array();
        if (this.y1 < this.y2) {
            if ((this.y2 - this.y1) == 1) {
                let rang1 = new CRange(this.x1, this.y1, this.x2, this.y1);
                let rang2 = new CRange(this.x1, this.y2, this.x2, this.y2);
                if (CRange.CheckValid(rang1) && CRange.CheckValid(rang2)) {
                    arr1.push(rang1);
                    arr1.push(rang2);
                }
            }
            else {
                let splity = CArrayHelper.RandomInt(this.y1, this.y2 - 1);
                let rang1 = new CRange(this.x1, this.y1, this.x2, splity);
                let rang2 = new CRange(this.x1, splity + 1, this.x2, this.y2);
                if (CRange.CheckValid(rang1) && CRange.CheckValid(rang2)) {
                    arr1.push(rang1);
                    arr1.push(rang2);
                }
            }
        }
        return arr1;
    }
    //查找相邻的Range
    FindConnectedBlock(arr2, rang3) {
        let idx = CArrayHelper.GetRandQueueInRange(arr2.length, 0, arr2.length - 1);
        for (let i = 0; i < idx.length; i++) {
            let rang2 = arr2[i];
            if (this.id != rang2.id) {
                //不同类的range进行相邻比较
                if (CRange.MergeConnectedBlock(this, rang2, rang3)) {
                    return i;
                }
            }
        }
        return -1;
    }
    //不同方向上尝试合并单元格
    static MergeConnectedBlock(rang1, rang2, rang3) {
        let idxs = CArrayHelper.GetRandQueue(null, 4);
        let iRes = false;
        rang3 = null;
        for (let i of idxs) {
            if (i == 0) {
                iRes = CRange.CheckConnectedUp(rang1, rang2, rang3);
            }
            else if (i == 1) {
                iRes = CRange.CheckConnectedDown(rang1, rang2, rang3);
            }
            else if (i == 2) {
                iRes = CRange.CheckConnectedLeft(rang1, rang2, rang3);
            }
            else if (i == 3) {
                iRes = CRange.CheckConnectedRight(rang1, rang2, rang3);
            }
            if (iRes) {
                break;
            }
        }
        return iRes;
    }
    //rang2 在 rang1 上面
    static CheckConnectedUp(rang1, rang2, rang3) {
        if (rang1.x1 == rang2.x1 && rang1.x2 == rang2.x2) {
            if ((rang2.y1 - rang1.y2) == 1) {
                rang3 = new CRange(rang1.x1, rang1.y1, rang1.x2, rang2.y2);
                return true;
            }
        }
        return false;
    }
    //rang2 在 rang1 下面
    static CheckConnectedDown(rang1, rang2, rang3) {
        if (rang1.x1 == rang2.x1 && rang1.x2 == rang2.x2) {
            if ((rang2.y2 - rang1.y1) == -1) {
                rang3 = new CRange(rang1.x1, rang2.y1, rang1.x2, rang1.y2);
                return true;
            }
        }
        return false;
    }
    //rang2 在 rang1 左面
    static CheckConnectedLeft(rang1, rang2, rang3) {
        if (rang1.y1 == rang2.y1 && rang1.y2 == rang2.y2) {
            if ((rang2.x2 - rang1.x1) == -1) {
                rang3 = new CRange(rang2.x1, rang1.y1, rang1.x2, rang2.y2);
                return true;
            }
        }
        return false;
    }
    //rang2 在 rang1 右面
    static CheckConnectedRight(rang1, rang2, rang3) {
        if (rang1.y1 == rang2.y1 && rang1.y2 == rang2.y2) {
            if ((rang2.x1 - rang1.x2) == 1) {
                rang3 = new CRange(rang1.x1, rang1.y1, rang2.x2, rang2.y2);
                return true;
            }
        }
        return false;
    }
    //判断范围的有效性
    static CheckValid(rang1) {
        if ((rang1.Count) <= 1) {
            return false;
        }
        return true;
    }
    //判断是否在内部
    CheckIn(x0, y0) {
        if (x0 >= this.x1 && x0 <= this.x2 && y0 >= this.y1 && y0 <= this.y2) {
            return true;
        }
        return false;
    }
    //获得在方格内部的序号
    GetInsideNumber(x0, y0) {
        if (this.CheckIn(x0, y0) == false)
            return -1;
        let iRes = 0;
        for (let y = this.y1; y <= this.y2; y++) {
            for (let x = this.x1; x <= this.x2; x++) {
                if (x == x0 && y == y0) {
                    return iRes;
                }
                ++iRes;
            }
        }
        return iRes;
    }
}
//零件
class CPart {
    get Count() {
        return this.items.length;
    }
    constructor() {
        //记录单元
        this.items = new Array();
        this.x0 = 0;
        this.y0 = 0;
    }
    Add(x, y, id2) {
        this.items.push(new Cell);
        this.items[this.items.length - 1].x = x;
        this.items[this.items.length - 1].y = y;
        this.items[this.items.length - 1].id = this.id;
        this.items[this.items.length - 1].id2 = id2; //写文字的序号
    }
    //根据坐标查找
    Find(x, y) {
        return null;
    }
    get minx() {
        let arr1 = this.items.map(item => { return item.x; });
        return Math.min.apply(null, arr1);
    }
    get miny() {
        let arr1 = this.items.map(item => { return item.y; });
        return Math.min.apply(null, arr1);
    }
    get maxx() {
        let arr1 = this.items.map(item => { return item.x; });
        return Math.max.apply(null, arr1);
    }
    get maxy() {
        let arr1 = this.items.map(item => { return item.y; });
        return Math.max.apply(null, arr1);
    }
}
//零件生成类
class CPartFactory {
    constructor() {
    }
    static GetPart(idx) {
        switch (idx) {
            case 0:
                return CPartFactory.part0();
            case 1:
                return CPartFactory.part1();
            case 2:
                return CPartFactory.part2();
        }
        return null;
    }
    //----
    static part0() {
        let p1 = new CPart();
        p1.id = 0;
        p1.Add(0, 0, 0);
        p1.Add(1, 0, 1);
        p1.Add(2, 0, 2);
        p1.Add(3, 0, 3);
        return p1;
    }
    //-
    //-
    //-
    //-
    static part1() {
        let p1 = new CPart();
        p1.id = 1;
        p1.Add(0, 0, 0);
        p1.Add(0, 1, 1);
        p1.Add(0, 2, 2);
        p1.Add(0, 3, 3);
        return p1;
    }
    //--
    //--
    static part2() {
        let p1 = new CPart();
        p1.id = 2;
        p1.Add(0, 0, 0);
        p1.Add(1, 0, 1);
        p1.Add(0, 1, 3);
        p1.Add(1, 1, 2);
        return p1;
    }
}
//数回
class CSlitherlinkGrid extends CChessGridBase {
    constructor() {
        super();
        this.MIN_LOOPS = 1;
        this.MAX_LOOPS = 3;
        this.numLoops = 0;
    }
    Load() {
        for (let y = 0; y < this.numRow; y++) {
            this.boxs.push([]);
            for (let x = 0; x < this.numCol; x++) {
                this.boxs[y].push(new Cell());
                this.boxs[y][x].x = x; //column
                this.boxs[y][x].y = y; //row
            }
        }
    }
    SetHard(hard) {
        this.hard = hard;
        if (this.hard == 1) {
            this.numLoops = this.numRow * this.numCol / 5;
        }
        else if (this.hard == 2) {
            this.numLoops = this.numRow * this.numCol / 2;
        }
        else if (this.hard == 3) {
            this.numCol = 7;
            this.numRow = 7;
            this.numLoops = this.numRow * this.numCol / 2;
        }
        else if (this.hard >= 4) {
            this.numCol = 10;
            this.numRow = 10;
            this.numLoops = this.numRow * this.numCol / 2;
        }
        //加载单元格
        this.Load();
        //生成
        this.Generate();
    }
    //Define a function to generate the puzzle by selecting random cells and connecting them 
    //until the desired number of loops is achieved
    Generate() {
        // while (numLoops < this.MIN_LOOPS || numLoops > this.MAX_LOOPS) {
        // Reset grid
        for (let row = 0; row < this.numRow; row++) {
            for (let col = 0; col < this.numCol; col++) {
                this.boxs[row][col].up = false;
                this.boxs[row][col].down = false;
                this.boxs[row][col].left = false;
                this.boxs[row][col].right = false;
            }
        }
        // Connect cells
        let posCell = this.RandomCell();
        let connectCount = 0;
        //形成连续的区域 保证取消块数一定
        while (connectCount < this.numLoops) {
            const neighbor = this.RandomConnection(posCell);
            if (neighbor) {
                posCell = neighbor;
            }
            connectCount = 0;
            for (let row = 0; row < this.numRow; row++) {
                for (let col = 0; col < this.numCol; col++) {
                    if (this.boxs[row][col].id >= 0) {
                        connectCount++;
                    }
                }
            }
        }
        //获得非路径区域
        let arrRangeNonPath = this.GetNotPathRangeCells();
        for (let arr2 of arrRangeNonPath) {
            if (this.CheckInnerRangeCell(arr2)) {
                //console.log(arr2);
                //内部的点改成路径点
                for (let c2 of arr2) {
                    c2.id = -2;
                    c2.id2 = 0;
                }
            }
        }
        //统计边数 含路径内 和 路径外
        let arr1 = [];
        for (let row = 0; row < this.numRow; row++) {
            for (let col = 0; col < this.numCol; col++) {
                let c1 = this.boxs[row][col];
                c1.id2 = 0;
                this.CountEdges(c1);
                if (c1.id > -1) {
                    //路径内的
                    arr1.push(c1);
                }
                else if (c1.id == -1) {
                    //路径外的
                    if (c1.id2 > 0) {
                        arr1.push(c1);
                    }
                }
            }
        }
        //随机获得可以显示的格式
        let arr2 = CArrayHelper.GetRandQueue(arr1, this.numLoops);
        for (let c1 of arr2) {
            c1['show'] = true;
        }
    }
    //Define a function to randomly select a cell from the grid
    RandomCell() {
        const row = CArrayHelper.RandomInt(0, this.numRow - 1);
        const col = CArrayHelper.RandomInt(0, this.numCol - 1);
        return { row, col };
    }
    //Define a function to randomly connect two adjacent cells
    RandomConnection(posCell) {
        const neighbors = [];
        if (posCell.row > 0)
            neighbors.push({ row: posCell.row - 1, col: posCell.col, dir: 'down' });
        if (posCell.row < this.numRow - 1)
            neighbors.push({ row: posCell.row + 1, col: posCell.col, dir: 'up' });
        if (posCell.col > 0)
            neighbors.push({ row: posCell.row, col: posCell.col - 1, dir: 'right' });
        if (posCell.col < this.numCol - 1)
            neighbors.push({ row: posCell.row, col: posCell.col + 1, dir: 'left' });
        const neighbor = neighbors[CArrayHelper.RandomInt(0, neighbors.length - 1)];
        if (neighbor) {
            const oppositeDir = { up: 'down', down: 'up', left: 'right', right: 'left' }[neighbor.dir];
            this.boxs[posCell.row][posCell.col].id = 1;
            this.boxs[neighbor.row][neighbor.col].id = 1;
            return neighbor;
        }
    }
    //判断非路径区域是否
    CheckInnerRangeCell(arr1) {
        for (let c1 of arr1) {
            //只要有一个存在边缘 就表示不是 在内部
            let c2up = this.NextCell(c1, CellDirection.up);
            let c2down = this.NextCell(c1, CellDirection.down);
            let c2right = this.NextCell(c1, CellDirection.right);
            let c2left = this.NextCell(c1, CellDirection.left);
            if (c2up == null || c2down == null || c2right == null || c2left == null) {
                return false;
            }
        }
        return true;
    }
    //获得非路径区域的单元格
    GetNotPathRangeCells() {
        let arr1 = [];
        let bfind = false;
        for (let row = 0; row < this.numRow; row++) {
            for (let col = 0; col < this.numCol; col++) {
                let c1 = this.boxs[row][col];
                bfind = false;
                if (c1.id == -1) {
                    //1.在arr1数组中查找 是否已经在存在的区块中 
                    for (let arr2 of arr1) {
                        if (arr2.indexOf(c1) >= 0) {
                            bfind = true;
                            break;
                        }
                    }
                    //2.如果不存在 就找到 这个区域
                    if (bfind == false) {
                        let arr2 = [];
                        this.GetRangeCells(c1, arr2);
                        arr1.push(arr2);
                    }
                }
            }
        }
        return arr1;
    }
    //获得跟 c1.id一样的一篇区域
    GetRangeCells(c1, arr1) {
        if (arr1.indexOf(c1) < 0) {
            arr1.push(c1);
        }
        //获得周围的单元格
        let c2up = this.NextCell(c1, CellDirection.up);
        let c2down = this.NextCell(c1, CellDirection.down);
        let c2right = this.NextCell(c1, CellDirection.right);
        let c2left = this.NextCell(c1, CellDirection.left);
        if (c2up && c2up.id == c1.id && arr1.indexOf(c2up) < 0) {
            this.GetRangeCells(c2up, arr1);
        }
        if (c2down && c2down.id == c1.id && arr1.indexOf(c2down) < 0) {
            this.GetRangeCells(c2down, arr1);
        }
        if (c2right && c2right.id == c1.id && arr1.indexOf(c2right) < 0) {
            this.GetRangeCells(c2right, arr1);
        }
        if (c2left && c2left.id == c1.id && arr1.indexOf(c2left) < 0) {
            this.GetRangeCells(c2left, arr1);
        }
    }
    NextCell(c1, eDir) {
        if (eDir == CellDirection.up) {
            return this.NextCellUp(c1);
        }
        else if (eDir == CellDirection.down) {
            return this.NextCellDown(c1);
        }
        else if (eDir == CellDirection.right) {
            return this.NextCellRight(c1);
        }
        else if (eDir == CellDirection.left) {
            return this.NextCellLeft(c1);
        }
        return null;
    }
    //获得up 单元格
    NextCellUp(c1) {
        if (c1.y < this.numRow - 1) {
            return this.boxs[c1.y + 1][c1.x];
        }
        return null;
    }
    //获得down 单元格
    NextCellDown(c1) {
        if (c1.y > 0) {
            return this.boxs[c1.y - 1][c1.x];
        }
        return null;
    }
    //获得right 单元格
    NextCellRight(c1) {
        if (c1.x < this.numCol - 1) {
            return this.boxs[c1.y][c1.x + 1];
        }
        return null;
    }
    //获得left 单元格
    NextCellLeft(c1) {
        if (c1.x > 0) {
            return this.boxs[c1.y][c1.x - 1];
        }
        return null;
    }
    //统计单元格所包含的边数
    CountEdges(c1) {
        let c2up = this.NextCell(c1, CellDirection.up);
        let c2down = this.NextCell(c1, CellDirection.down);
        let c2right = this.NextCell(c1, CellDirection.right);
        let c2left = this.NextCell(c1, CellDirection.left);
        if (c1.id == -1) {
            //非路径中的边数判断
            //left
            if (c2left && c2left.id > -1) {
                ++c1.id2;
            }
            //right
            if (c2right && c2right.id > -1) {
                ++c1.id2;
            }
            //down
            if (c2down && c2down.id > -1) {
                ++c1.id2;
            }
            //up
            if (c2up && c2up.id > -1) {
                ++c1.id2;
            }
            if (c1.id2 == 4) {
                //表示此格在封闭的内部，为无效
                c1.id2 = -1;
            }
        }
        else if (c1.id >= 0) {
            //路径中的边数判断
            //left
            if (c1.x <= 0 || (c2left && c2left.id == -1)) {
                ++c1.id2;
            }
            //right
            if (c1.x >= this.numCol - 1 || (c2right && c2right.id == -1)) {
                ++c1.id2;
            }
            //down
            if (c1.y <= 0 || (c2down && c2down.id == -1)) {
                ++c1.id2;
            }
            //up
            if (c1.y >= this.numRow - 1 || (c2up && c2up.id == -1)) {
                ++c1.id2;
            }
        }
    }
}
