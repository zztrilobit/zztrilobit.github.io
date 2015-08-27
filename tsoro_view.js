
var TsoroView=(function(){
	var kv=function (){
		this.holes=[[],[]];
		
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
		this.view_board=Utils.table(6,bs);
		
		
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
	    var b=new TsoroBoard();
		b.makeBoard(bs);
		
		for(i=0; i<bs; i++){
			var c,d;
			//c= this.tag('div').appendTo(holes.cells[1][i]);
			this.view_board.cells[0][i].css(styleHdr).html(bs-i);
			this.view_board.cells[5][i].css(styleHdr).html(i+1);
			
			c=this.view_board.cells[4][i].css(styleBody);
			this.holes[0][b.index(0,i)]=c;
			
			c=this.view_board.cells[3][i].css(styleBody);
			this.holes[0][b.index(1,i)]=c;
			
			c=this.view_board.cells[2][i].css(styleBody);
			this.holes[1][b.index(1,bs-1-i)]=c;
			
			c=this.view_board.cells[1][i].css(styleBody);
			this.holes[1][b.index(0,bs-1-i)]=c;
			
			}
	};

	proto.click=function(f){
		var i ;
	    var b=new TsoroBoard();
		b.makeBoard(this.bs);
	
		for (i=0; i<this.bs*2; i++){
			var l,c;
			
			l=b.cell_line(i);
			c=b.cell_col(i);
			
			this.holes[1][i].click(
			  (function(l,c){ 
			      return (function(){f(1,l,c);});
				  } )(l,c)
			);
			this.holes[0][i].click(
			  (function(l,c){ 
			      return (function(){f(0,l,c);});
				  } )(l,c)
			);
		}
		
	};
    // отрисовывает доску наподготовленном отображении	
	proto.draw=function(b){
		var i;
		for (i=0;i<this.bs*2;i++){
			this.holes[1][i].html(b.brd[1][i]);
			this.holes[0][i].html(b.brd[0][i]);
		};
		
	};
	
	return kv;
})();
        
		
