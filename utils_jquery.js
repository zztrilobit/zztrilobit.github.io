var Utils={
	cust_props: function(el) {
		var res={};
		res.el=el;
		
		res.appendTo=function(a){
			res.el.appendTo(a.el);
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
	
	tag: function(t){
		var res=  $("<"+t+">"+"</"+t+">");
		return this.cust_props(res);
		//alert(res);
		
    }

};
