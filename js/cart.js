$(()=>{
    // 把购物车的数据从本地存储里面读取出来
    let jsonStr = localStorage.getItem('shopCartData');
    // 判断jsonStr是否为null就没有数据,如果不是null,就是有数据,需要生成购物车的商品列表
    let arr;
    if (jsonStr !==null){
        arr = JSON.parse(jsonStr);
        // 遍历数组,生成结构
        let html= '';
        arr.forEach(e=>{
            html += `<div class="item" data-id="${e.pID}">
            <div class="row">
              <div class="cell col-1 row">
                <div class="cell col-1">
                  <input type="checkbox" class="item-ck" checked="">
                </div>
                <div class="cell col-4">
                  <img src="${e.imgSrc}" alt="">
                </div>
              </div>
              <div class="cell col-4 row">
                <div class="item-name">${e.name}</div>
              </div>
              <div class="cell col-1 tc lh70">
                <span>￥</span>
                <em class="price">${e.price}</em>
              </div>
              <div class="cell col-1 tc lh70">
                <div class="item-count">
                  <a href="javascript:void(0);" class="reduce fl">-</a>
                  <input autocomplete="off" type="text" class="number fl" value="${e.number}">
                  <a href="javascript:void(0);" class="add fl">+</a>
                </div>
              </div>
              <div class="cell col-1 tc lh70">
                <span>￥</span>
                <em class="computed">${e.price * e.number}</em>
              </div>
              <div class="cell col-1">
                <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
              </div>
            </div>
          </div>`
        });
        // 把html格式的字符串,放到div里面
        $('.item-list').html(html);
        // 把空空如也隐藏
        $('.empty-tip').hide();
        // 把表头+总计显示出来
        $('.cart-header').removeClass('hidden');
        $('.total-of').removeClass('hidden')
    }


    // 计算总和和总价
    function computedCountAndMoney(){
        // 算出总计里面的总数量和总价
        // 根据选中的多选框,得到选中的商品的id
        let totalCount = 0;
        let totalMoney = 0;
        $('.item-list input[type=checkbox]:checked').each((i,e)=>{
            let id = parseInt($(e).parents('.item').attr('data-id'));
            arr.forEach(e =>{
                if(id === e.pID){
                    // 勾选的在本地存储中的数据
                    totalCount += e.number;
                    totalMoney += e.number*e.price;
                }
            })
        });
        // 修改数量和总价
        $('.selected').text(totalCount);
        $('.total-money').text(totalMoney);
    }
    computedCountAndMoney();

    // 实现全选和不全选
    $('.pick-all').on('click',function(){
        // 看看自己当前的状态
        let status = $(this).prop('checked');
        // 设置每个商品都和自己一样
        $('.item-ck').prop('checked',status);
        // 还要把上下两个全选的同步
        $('.pick-all').prop('checked',status);
        computedCountAndMoney();
    })

    // 其实这里更加建议使用委托来实现,因为所有商品的信息都是动态生成的,从服务器获取数据,会失败的,必须是用委托
    $('.item-ck').on('click',function(){
        // 判断是否全选,如果选中的个数和所有的个数是一致的,就是全选了
        let isAll = $('.item-ck').length === $('.item-ck:checked').length;
        $('.pick-all').prop('checked',isAll);
        computedCountAndMoney();
    })

    // 使用事件委托的方式实现加减
    $('.item-list').on('click','.add',function(){
        // 点击加号,把对应的输入框的文字进行+1
        // 得到旧数据
        let oldval = parseInt($(this).siblings('input').val());
        oldval++;
        if(oldval>1){
            $(this).siblings('.reduce').removeClass('disabled');
        }
        // 设置回去
        $(this).siblings('input').val(oldval);
        // 把本地存储里面的数据,更新
        // 判断依据是,点击的按钮对应的商品的id
        let id = parseInt($(this).parents('.item').attr('data-id'));
        let obj = arr.find(e =>{
          return e.pID === id;
        });
        // 更新对应的数据
        obj.number = oldval;
        // 还要覆盖回本地数据
        let jsonStr = JSON.stringify(arr);
        localStorage.setItem('shopCartData',jsonStr);
        // 重新计算总数和总价
        computedCountAndMoney();
        // 还要把对应商品的钱也要计算
        $(this).parents('.item').find('.computed').text(obj.price*obj.number);

    })

    $('.item-list').on('click','.reduce',function(){
      let oldval = parseInt($(this).siblings('input').val());
      // 如果当前的值已经是1了,就不能点击了
      if(oldval ===1 ){
        return;
      }
      oldval--;
      if(oldval ===1){
        // 给按钮添加一个样式,不能点击的样式
        $(this).addClass('disabled');
      }

      $(this).siblings('input').val(oldval);
      let id = parseInt($(this).parents('.item').attr('data-id'));
      let obj = arr.find(e=>{
        return e.pID === id;
      });
      // 更新对应的数据
      obj.number = oldval;
      // 还要覆盖回本地数据
      let jsonStr = JSON.stringify(arr);
      localStorage.setItem('shopCartData',jsonStr);
      // 重新计算总数和总价
      computedCountAndMoney();
      $(this).parents('.item').find('.computed').text(obj.price*obj.number);
    })
    // 实现删除
    $('.item-list').on('click','.item-del',function(){
      // 因为我们删除的动作是在点击确定之后运行,点击确定是另外一个函数了,该函数里面的this已经不是移除按钮,我们可以这里先保存一个this
      let _this = this;
      // 弹出确认框
      $('#dialog-confirm').dialog({
        resizable: false,
        height :140,
        modal : true,
        buttons:{
          "确认":function(){
            $(this).dialog("close");
            // 把对应商品删除
            // 把对应的结构移除
            $(_this).parents('.item').remove();
            // 把本地数据移除
            // 我们现在需要根据id获取本地存储里面的数据
            let id = parseInt($(_this).parents('.item').attr('data-id'));
            // 在H5里面的数组新增了一个方法,获取满足条件的元素的索引
            let index = arr.findIndex((e)=>{
              return e.pID ===id;
            })
            arr.splice(index,1);
            // 把数据覆盖回本地
            let jsonStr = JSON.stringify(arr);
            localStorage.setItem('shopCartData',jsonStr);
          },
          "取消":function(){
            $(this).dialog("close");
          }
        }
      })
    })
 
})