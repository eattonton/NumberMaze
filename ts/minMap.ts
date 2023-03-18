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
}

class CMineMap {
    public numRow: number = 5;
    public numCol: number = 5;
    public hard: number = 2;
    public numMine:number = 0;  //记录地雷数量
    //二维数组
    public boxs: Array<Array<Cell>> = new Array<Array<Cell>>();

    public constructor() {
        
    }

    public SetHard(hard:number){
        this.hard = hard;
        if(hard == 3){
            this.numRow = 10;
            this.numCol = 10;
        }else if(hard == 4){
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
                if(this.AddMine(arr1[i], y)){
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
                if(c1.tag != "m"){
                    //非雷区统计它周围的雷数量
                    let arr2 = this.GetNearCells(c1);
                    c1.id = 0;
                    for(let c2 of arr2){
                        if(c2.tag == "m"){
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

    private GetNearCellsByTag(c1:Cell, tag:string):Array<Cell>{
        let arr1 = this.GetNearCells(c1);
        let arr2 = [];

        for(let c1 of arr1){
            if(c1.tag == tag){
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
                if(c1.tag == "m"){
                    //雷区统计它周围的数量格
                    let arr2 = this.GetNearCellsByTag(c1,"n");
                    if(arr2.length >= 2){
                        //生成随机的两位数组
                        let arr3 = CArrayHelper.GetRandQueueInRange(2, 0, arr2.length-1);
                        for(let i2 of arr3){
                            let c2 = arr2[i2];
                            this.boxs[c2.y][c2.x].id2 = 1;   //显示
                        }

                    }
                }
            }
        }
    }

}


class CArrayHelper {
    //生成随机值
    public static RandomInt(min, max): number {
        var span = max - min + 1;
        var result = Math.floor(Math.random() * span + min);
        return result;
    }
    //在范围内，生成一定数量不重复的随机数
    public static GetRandQueueInRange(n: number, min: number, max: number): Array<number> {
        let arr = [];
        // 在此处补全代码
        for (let i = 0; i < n; i++) {
            let number = CArrayHelper.RandomInt(min, max);
            if (arr.indexOf(number) == -1) { //去除重复项
                arr.push(number);
            } else {
                i--;
            }
        }
        return arr;
        //return Array.from({ length: n }, v => arrayHelper.RandomInt(min, max));
    }

    //生成随机队列
    public static GetRandQueue(array: Array<number>, size: number): Array<number> {
        if (!array) {
            array = new Array();
            for (let i = 0; i < size; i++) {
                array[i] = i;
            }
        }
        let res = [], random;
        let array2 = [...array];
        while (array2.length > 0) {
            random = Math.floor(Math.random() * array2.length);
            res.push(array2[random]);
            array2.splice(random, 1);
        }
        return res;
    }

    //随机生成 同一个宫内的值
    public static GetRandPosition(n: number, size: number): number {
        if (n == undefined || n == null || n == -1) {
            return CArrayHelper.RandomInt(0, size - 1);
        } else {
            //生成的随机数 不能与 n相同，而且必须在同一个宫中
            let boxn = Math.floor(n / size);
            for (let i = 0; i < 1000; i++) {
                let n2 = CArrayHelper.RandomInt(0, size - 1);
                let boxn2 = Math.floor(n2 / size);
                if (n2 != n && boxn == boxn2) {
                    return n2;
                }
            }
        }

        return -1;
    }

}