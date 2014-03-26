var moves={
  tot_moves:0,
  current:0,
  positions:[],
  start_time:0,
  end_time:0,
  mode:'game',
 
 now : function() {
    return (new Date()).getTime();
  },
  init: function() {
     $("#moves_ctrl").show();
     $("#moves_work").hide();
     $("#moves_description").show();
     $("#moves_result").hide();
  },

col_name: function(n) {
  return "abcdefghijk".charAt(n-1);
},
cell_name: function(c) {
  return this.col_name(c.x)+c.y;
},

start: function() {
  this.start_time=this.now();
  $("#moves_ctrl").hide();
  $("#moves_description").hide();
  $("#moves_result").hide();
  
  this.field_size=parseInt($("#moves_field_size").val());
  this.point_cnt=parseInt($("#moves_point_cnt").val());
  this.tot_moves=parseInt($("#moves_step_cnt").val());
  
  //скрываем все строчки ответа
  var i;
  this.positions=[];
  pos_str="";
  for (i=1;i<=4;i++) 
  { var p={x:0,y:0,old:""};
    $("#moves_ansv1").val("");
	$("#moves_tr1").html("");
	if ((i==1)||(i==3)) {p.x=1;} else {p.x=this.field_size;};
	if ((i==1)||(i==4)) {p.y=1;} else {p.y=this.field_size;};
	this.positions[i]=p;
	if (i<=this.point_cnt) {  
	   $('#moves_ansv_row'+i).show(); 
	   pos_str=pos_str+" "+i+": "+this.cell_name(p)+";  "
	}
	else $('#moves_ansv_row'+i).hide();
  }
  this.current=1;
  $("#moves_init_pos").show();
  $("#moves_init_pos").html(pos_str);
  $("#moves_work").show();
  $("#moves_learn").hide();
  $("#moves_learn").html("");
  
  this.gen_move();
},

start_learn: function() {
  this.start();
  this.mode="learn";
   $("#moves_learn").show();
  },

debug : function (log_txt) {
    if (typeof window.console != 'undefined') {
        console.log(log_txt);
    } else {
	  $('#moves_debug').html($('#moves_debug').html()+'<p>'+log_txt);
	}
},

//Случайное целое в диапазоне
  getRandomArbitrary: function (min, max) {
    return Math.floor(Math.random() * (max - min+0.9999) + min);
  } ,

move_to_text : function (m) {
  return (["налево","","направо"][(m.x)+1])+" "+(['вниз','','вверх'][(m.y)+1]);
},

gen_move: function() {
  var moves=[ 
  {x:-1,y:-1}, 
  {x:-1,y:0}, 
  {x:-1,y:1}, 

  {x:0,y:-1}, 
  {x:0,y:1}, 

  {x:1,y:-1}, 
  {x:1,y:0}, 
  {x:1,y:1}
  ];
  var i,j;
  
  var point_to_move;
  if (this.point_cnt==1) {
    point_to_move=1;
  } else {
     point_to_move=this.getRandomArbitrary(1,this.point_cnt);
	 
  }
 
  // построим список движений, которые может сделать точка
  var en_mov_cnt=0;
  var en_moves=[];
  
  var checked;
  var new_pos=[];  
  var all_new_positions=[];
  var all_new_moves=[];
  var possible_moves_count=0;
  var cur_pos;
  
  while (!possible_moves_count) {
	  new_pos={};  
	  all_new_positions=[];
	  all_new_moves=[];
	  cur_pos=this.positions[point_to_move];
	  for (i=0;i<8;i++) {
	    
		new_pos.x=cur_pos.x + (moves[i]).x;
		new_pos.y=cur_pos.y + (moves[i]).y;
		
		// проверим, что не выходит за пределы поля, и не пошли ли мы назад
		checked=1;
		if ((new_pos.x<1) || (new_pos.x>this.field_size) ||
			(new_pos.y<1) || (new_pos.y>this.field_size) ||
             cur_pos.old_pos==this.cell_name(new_pos)			) {
			checked=0;
			}
		//проверим наложение точек
		for(j=1;j<=this.point_cnt;j++) {
		   if ((this.positions[j].x==new_pos.x) && (this.positions[j].y==new_pos.y) ) checked=0;
		}
		if (checked) {
		  //массивы приходится клонировать((((
		  all_new_positions.push({x:new_pos.x,y:new_pos.y});
		  all_new_moves.push({x:(moves[i]).x,y:(moves[i]).y});
		}
	  }
	  possible_moves_count=all_new_moves.length;
	  // если изначально случайно выбранная точка не может двигаться - переходим к следующей
	  if (possible_moves_count==0) {
	    point_to_move++; 
		if (point_to_move>this.point_cnt) point_to_move=1;
	  }
  }
  var rm=this.getRandomArbitrary(0,possible_moves_count-1);
  var point=this.positions[point_to_move];
  var first_pos={x:point.x,y:point.y};
  var old_pos=this.cell_name(first_pos);
  point.x=all_new_positions[rm].x;
  point.y=all_new_positions[rm].y;
  point.old_pos=old_pos;
  //this.debug(all_new_positions);
  
  $("#moves_learn").html($("#moves_learn").html()+"<p>"+"Двигаем "+point_to_move+" "+this.cell_name(first_pos)+ "["+this.move_to_text(all_new_moves[rm]) +"]->"+this.cell_name(all_new_positions[rm]));
  $("#moves_quest").html(""+point_to_move+": "+this.move_to_text(all_new_moves[rm]));
},

next: function() {
  if (this.current==this.tot_moves) {    
    $("#moves_work").hide();
    $("#moves_result").show();
    //$("#moves_learn").show();
    $("#moves_ctrl").show();
	$("#moves_description").show();
	this.end_time=this.now();
  } else { this.gen_move();  
  }
  this.current++;
},

check: function() {
  var i;
  var true_cnt=0;
  var tr_cell;
  //подсчитываем правильные ответы
  for (i=1;i<=this.point_cnt;i++) {
    tr_cell=this.cell_name(this.positions[i]);
    if($('#moves_ansv'+i).val()==tr_cell) true_cnt++;
	$("#moves_tr"+i).html(tr_cell);
  }
  $("#moves_true_cnt").html("Поле: "+this.field_size+"<p>Ходов: "+this.tot_moves+"<p>Точек: "+this.point_cnt+" из них правильно "+true_cnt+"<p>Время полное: "+Math.round((this.end_time-this.start_time)/1000)+" сек"+"<p>В среднем на ход: "+Math.round((this.end_time-this.start_time)/(this.tot_moves*10))/100);
}

};


