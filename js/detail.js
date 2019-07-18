$(()=>{

    let id = location.search.substring(4);
    console.log(id);

    let obj = phoneData.find(function(e,i){

        return e.pID == id;

    })
    $('.sku-name').text(obj.name);
    $('.summary-price em').text('￥'+obj.price);
    $('.preview-img > img').attr('src',obj.imgSrc);

    let chooseNumber = $('choose-number');
    let addBtn = $('add');
    let reduceBtn = $('reduce');

    // 先做+
    addBtn.on('click',function(){
        // 让件数+1
        // 先获得原来是多少件
        let old = parseInt(chooseNumber.val());
        old++;
        if(old > 1){
            reduceBtn.removeClass('disabled');
        }
        chooseNumber.val(old);
    })

    // 点-号
    reduceBtn.on('click',function(){
        // 让胡数量减少
        let old = parseInt(chooseNumber.val());
        if(old == 1 ){
            return;
        }
        old--;
        if(old ===1 ){
            reduceBtn.addClass('disabled');
        }
        // 把新的数据设置回输入框
        chooseNumber.val(old);
    })





    // 点击加入购物车的功能
    $('.addshopcar').on('click',function(){
        // 把对应的商品信息加入购物车,只有数量是未知的,需要获取
        let number = parseInt($('.choose-number').val());
        // 先从本地数据里读取数据,然后把心旧数据叠加
        let jsonStr = localStorage.getItem('shopCartData');
        let arr;
        // 需要判断到底是否有数据
        if(jsonStr ===null){
            arr = [];
        }else{
            arr = JSON.parse(jsonStr);
        }
        // find 方法,如果找到元素,就会返回元素,但是如果找不到,会返回undefined
        let isExit = arr.find(e=>{
            return e.pID === id;
        });
        // 如果isExit是undefined ,就是没有
        if(isExit !== undefined){
            // 把数量叠加
            isExit.number +=number;
        }else {
            // 如果没有出现,才是新增一个
            let good = {
                pID : obj.pID,
                name : obj.name,
                price : obj.price,
                imgSrc : obj.imgSrc,
                number : number
            }
            arr.push(good);
        }
        // 把数组变成json格式的字符串,存储到localStorage里面
        jsonStr = JSON.stringify(arr);
        localStorage.setItem('shopCartData',jsonStr);
        // 我们可以直接点击之后,跳转到购物车页面,进行运算
        location.href = 'cart.html';
    })
});