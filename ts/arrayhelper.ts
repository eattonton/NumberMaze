
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
            let num1 = CArrayHelper.RandomInt(min, max);
            if (arr.indexOf(num1) == -1) { //去除重复项
                arr.push(num1);
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
        let res = [], random1;
        let array2 = [...array];
        while (array2.length > 0) {
            random1 = Math.floor(Math.random() * array2.length);
            res.push(array2[random1]);
            array2.splice(random1, 1);
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