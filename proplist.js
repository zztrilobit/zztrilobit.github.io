var PropList=(function(){
		var cnstr=function(){
			this.view=null;
			this.controls={};
			
		};
		var proto=cnstr.prototype;
		
		proto.get=function(id){
			return this.controls[id].el.val();
		};
		proto.getInt=function(id){
			return parseInt(this.get(id));
		};
		proto.make=function(arr,d_css){
			// на входе массив хэшей - id, caption, type, content
			var i;
			this.view=Utils.table(arr.length,2);
			var v=this.view;
			var c=this.controls={};
			for (i=0; i<arr.length; i++) {
				var ai=arr[i];
				v.cells[i][0].html(ai.caption);
				if (typeof(d_css)!='undefined') v.cells[i][0].css(d_css);
				var elm='';
				if (arr[i].type='select') {
					elm=Utils.select(ai.content,d_css);
					};
				var d = Utils.tag('div').appendTo(v.cells[i][1]);
				c[ai.id]=elm.appendTo(d);
				};
				
		}
		return cnstr;
})();