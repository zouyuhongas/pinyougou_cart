var kits = {};
// 封装一个根据键获取数组的方法
kits.loadArray = function(key){
    let str = localStorage.getItem(key);
    let arr;
    if(str === null){
        arr = [];
    }else{
        // 最重要的是一个数组
        arr = JSON.parse(str);
    }
    return arr;
}