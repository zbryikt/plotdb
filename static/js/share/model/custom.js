function in$(e,t){for(var r=-1,i=t.length>>>0;++r<i;)if(e===t[r])return!0;return!1}var model,base,chartConfig;model=require("./engine/share/model/"),base={},base.dataset=new model({name:"dataset",types:["csv"],defaultFields:!0,lint:function(e){var t,r,i,d,a;if(!e)return[!0];if("object"!=typeof e)return[!0];if(!e.name||"string"!=typeof e.name)return[!0,null,"name"];if(!in$(e.datatype,base.dataset.config.types))return[!0,null,"type"];for(t=0,i=(r=["createdTime","modifiedTime"]).length;i>t;++t)if(d=r[t],e[d]&&(a=model.type.date.lint(e[d]),a[0]))return a;return[!1]}}),base.file=new model({name:"file",base:{name:{max:100,min:1,required:!1,type:model.type.string},type:{max:20,min:1,required:!1,type:model.type.string},content:{required:!1,type:model.type.string}}}),base.theme=new model({name:"theme",defaultFields:!0,base:{name:{max:100,min:1,required:!0,type:model.type.string},doc:{type:base.file},style:{type:base.file},code:{type:base.file},likes:{required:!1,type:model.type.number},parent:{required:!1,type:model.type.key({type:base.theme})},createdTime:{required:!1,type:model.type.date},modifiedTime:{required:!1,type:model.type.date}}}),chartConfig={name:"chart",defaultFields:!0,base:{name:{max:100,min:1,required:!0,type:model.type.string},desc:{max:200,min:1,required:!1,type:model.type.string},basetype:{max:20,min:1,required:!1,type:model.type.string},visualencoding:{max:10,required:!1,type:model.type.array({max:20,min:1,type:model.type.string})},category:{max:10,required:!1,type:model.type.array({max:20,min:1,type:model.type.string})},tags:{required:!1,type:model.type.array({max:50,min:1,type:model.type.string})},doc:{type:base.file},style:{type:base.file},code:{type:base.file},theme:{required:!1,type:model.type.key({type:base.theme})},assets:{required:!1,type:model.type.array({type:base.file})},config:{require:!1},dimension:{require:!1},data:{required:!1},likes:{required:!1,type:model.type.number},parent:{required:!1,type:model.type.key({type:base.chart})},permission:{required:!1,type:model.type.permission},thumbnail:{required:!1,type:model.type.string},isType:{required:!1,type:model.type["boolean"]},createdTime:{required:!1,type:model.type.date},modifiedTime:{required:!1,type:model.type.date}}},base.chart=new model(chartConfig),module.exports=base;