
var KalahView=(function(){
	var kv=function (){
		this.holes=[[],[]];
		
		this.man=[];
		
		this.view_board='';
	};
	
	
	var proto=kv.prototype;
	
	proto.tag=function(t){
		//alert (t);
		return Utils.tag(t);
	};
	proto.makeBoard=function(bs){
		this.holes=[[],[]];
 		this.man=[];
		this.bs=bs;
		this.view_board=Utils.table(1,3);
		var styleMan = {
          valign: "middle",
          "text-align": "center",
          width: 60,
          "font-size": "xx-large",
          "font-weight": "bold"
        };
		this.man[1] = this.view_board.cells[0][0].css(styleMan);
		var mdl = this.view_board.cells[0][1];
		this.man[0] = this.view_board.cells[0][2].css(styleMan);;
		var holes=Utils.table(4,bs).appendTo(mdl);
		
		var i;
		styleHdr = {
        valign: "middle",
        "text-align": "center",
        width: 60,
        height: 30
      };
      styleBody = {
        valign: "middle",
        "vertical-align": "middle",
        "text-align": "center",
        width: 60,
        height: 60,
        "font-size": "xx-large",
        "border-top": "solid",
        "border-bottom": "solid",
        "border-left": "solid",
        "border-right": "solid",
        "border": "1px solid black",
        "border-radius": "20px",
        "padding": "0px"
      };
		for(i=0; i<bs; i++){
			var c,d;
			//c= this.tag('div').appendTo(holes.cells[1][i]);
			c= holes.cells[1][i];
			c.css(styleBody);
			this.holes[1][bs-i-1]=c;
			
			//c=this.tag('div').appendTo(holes.cells[2][i]);
			c=holes.cells[2][i];
			c.css(styleBody);
			this.holes[0][i]=c;
			//c.appendTo(sr);
			holes.cells[3][i].css(styleHdr).html(bs-i);
			holes.cells[0][i].css(styleHdr).html(i+1);
		}
	};

	proto.click=function(f){
		var i ;
		for (i=0; i<this.bs; i++){
			this.holes[1][i].click(
			  (function(i){ 
			      return (function(){f(1,i);});
				  } )(i)
			);
			this.holes[0][i].click(
			  (function(i){ 
			      return (function(){f(0,i);});
				  } )(i)
			);
		}
		
	};
    // отрисовывает доску наподготовленном отображении	
	proto.draw=function(b){
		var i;
		for (i=0;i<this.bs;i++){
			this.holes[1][i].html(b.getCell(1,i));
			this.holes[0][i].html(b.getCell(0,i));
		};
		this.man[0].html(b.getKala(0));
		this.man[1].html(b.getKala(1));
	};
	
	return kv;
})();
        
		
