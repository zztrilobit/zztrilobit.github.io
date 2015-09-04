var Utils={
	cust_props: function(el) {
		var res={};
		res.el=el;
		
		res.appendTo=function(a){
			res.el.appendTo(a.el);
			return res;
		};
		res.val=function(a){
			return res.el.val(a);
		};
		res.css=function(c){
			res.el.css(c);
			return res;
		};
		res.show=function(){
			res.el.show();
			return res;
		};
		res.hide=function(){
			res.el.hide();
			return res;
		};
		res.css=function(c){
			res.el.css(c);
			return res;
		};
		res.html=function(h){
			res.el.html(h);
			return res;
		};
		res.click=function(f){
			res.el.click(f);
			return res;
		};
		res.prepend=function(f){
			res.el.prepend(f.el);
		};
		return res;
	},
	
	byId : function(id){
			return this.cust_props($("#"+id));
		},
	
	table: function(rows,cols){
		var res=this.tag('table');
		var i,j,cells=[];
		for (i=0;i<rows;i++) {
			var r= this.tag("tr").appendTo(res);
			cells[i]=[];
			for (j=0;j<cols;j++) {
				cells[i][j]=this.tag('td').appendTo(r);
			};
		};
		res.cells=cells;
		return res;
	},

	button: function(caption){
		var res=this.tag('button').html(caption);
		if (typeof(res.el.button)=='function' ) res.el.button();
		return res;
        },

	select: function(content,d_css){
		var res=this.tag('select');
			
		if (typeof(d_css)!='undefined')	res.css(d_css);
		var k;
		for (k in content) {
			if (content.hasOwnProperty(k)) {
				var o=Utils.tag('option');
				o.el.val(k);
				o.html(content[k]);
				o.appendTo(res);
			}
        };
		//if (typeof(res.el.selectmenu)=='function' ) 
		//	res.el.selectmenu().show();
		return res;
	},
	
	tag: function(t){
		var res=  $("<"+t+">"+"</"+t+">");
		return this.cust_props(res);
		//alert(res);
		
    }

};
