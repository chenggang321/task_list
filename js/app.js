/**
 * Created by HH_Girl on 2017/7/25.
 */
//存取localStorage中的数据
var store={
    save(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    },
    fetch(key){
        return JSON.parse(localStorage.getItem(key))
    }
}

//数据
//var list =[
//    {
//        title:"添加数据1",
//        isChecked:false,
//    },
//    {
//        title:"添加数据2",
//        isChecked:true,
//    }
//];
if(store.fetch("myStore")){
    var list=store.fetch("myStore");
}else{
    var list=[];
}

//vm
var vm=new Vue({
    el:".main",
    data:{
        list:list,
        todo:"",
        editTodos:"",
        beforeTitle:"",//记录正在编辑的任务
        visibility:"all"//显示所有任务
    },
    watch:{
        //浅监控
        //list:function(){//监控list这个属性当他发生变化执行函数
        //    store.save("myStore",this.list);
        //}
        //深监控
        list:{
            handler:function(){
                store.save("myStore",this.list);
            },
            deep:true
        }
    },
    computed:{
        noCheckedLength:function(){
            return this.list.filter(function(item){
                return !item.isChecked
            }).length
        },
        filteredList:function(){
            //过滤有三种情况
            var filter={
                all:function(list){
                    return list;
                },
                finished:function(){
                    return list.filter(function(item){
                        return item.isChecked
                    });
                },
                unfinished:function() {
                    return list.filter(function (item) {
                        return !item.isChecked
                    });
                }
            }
            //找到则返回对应数据否则返回全部数据
            return filter[this.visibility] ? filter[this.visibility](list) : list;
        }
    },//计算属性
    methods:{
        addTodo(ev){//添加任务
            //向list中添加一项
            //事件处理函数中的this指向的是
            this.list.push({
                title:this.todo,
                isChecked:false,
            });
            this.todo=""
        },
        deleteTodo(todo){//删除任务
            var index=this.list.indexOf(todo);
            this.list.splice(index,1)
        },
        editTodo(todo){//编辑任务
            this.beforeTitle=todo.title;
            this.editTodos=todo;
        },
        editTodoed(todo){//编辑成功
            this.editTodos="";
        },
        canselTodo(todo){//取消编辑任务
            todo.title=this.beforeTitle;
            this.beforeTitle="";
            //让view显示出来
            this.editTodos="";
        }
    },//自定义函数
    directives:{
        "focus":{
            update(el,binding){
                if(binding.value){
                    el.focus();
                }
            }
        }
    }//自定义属性
});
function watchHashChange(){
    var hash=window.location.hash.slice(1);
    console.log(hash);
    vm.visibility=hash;
}
watchHashChange();
//使用hashchange事件切换任务列表
window.addEventListener("hashchange",function(){
    watchHashChange();
})