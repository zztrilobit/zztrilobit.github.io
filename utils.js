var Utils={
	cust_props: function(el) {
		var res={};
		res.el=el;
		
		res.appendTo=function(a){
			a.el.appendChild(res.el);
			return res;
		};
		res.css=function(c){
			for (i in c) {
				res.el.style[i]=c[i];
			};
			return res;
		};
		res.html=function(h){
			res.el.innerHTML=h;
			return res;
		};
		res.click=function(f){
			res.el.onclick=f;
			return res;
		};
		res.prepend=function(f){
			res.el.insertBefore(f.el,res.el.firstChild);
		};
		return res;
	},
	
	byId : function(id){
			return this.cust_props(document.getElementById(id));
		},
	
	table: function(rows,cols){
		var res=this.tag('table');
		var i,j,cells=[];
		for (i=0;i<rows;i++) {
			var r=res.el.insertRow(i);
			cells[i]=[];
			for (j=0;j<cols;j++) {
				cells[i][j]=this.cust_props(r.insertCell(j));
			};
		};
		res.cells=cells;
		return (res);
	},
	
	tag: function(t){
		var res= document.createElement(t);
		return this.cust_props(res);
		//alert(res);
		
    }

};
