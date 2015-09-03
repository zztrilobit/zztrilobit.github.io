
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
		this.hand=[];
		this.bs=bs;
		this.view_board=Utils.tag('div');
		this.hand[1]=Utils.tag('div').css({"font-size": "x-large"}).appendTo(this.view_board)
		var t=Utils.table(6,bs).appendTo(this.view_board);
		this.hand[0]=Utils.tag('div').css({"font-size": "x-large"}).appendTo(this.view_board)
		
		
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
			t.cells[0][i].css(styleHdr).html(bs-i);
			t.cells[5][i].css(styleHdr).html(i+1);
			
			c=t.cells[4][i].css(styleBody);
			this.holes[0][b.index(0,i)]=c;
			
			c=t.cells[3][i].css(styleBody);
			this.holes[0][b.index(1,i)]=c;
			
			c=t.cells[2][i].css(styleBody);
			this.holes[1][b.index(1,bs-1-i)]=c;
			
			c=t.cells[1][i].css(styleBody);
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
			this.holes[1][i].html( b.brd[1][i]!=0 ? b.brd[1][i] : '');
			this.holes[0][i].html( b.brd[0][i]!=0 ? b.brd[0][i] : '');
		};
		this.hand[0].html(b.hand[0] !=0 ? 'В руке ' + b.hand[0] : '');
		this.hand[1].html(b.hand[1] !=0 ? 'В руке ' + b.hand[1] : '');
	};
	
	return kv;
})();
        
		
