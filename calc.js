var verb_acc={
   sample:"",
   //правильный ответ
   true_ansver:"",
   //всего решалось
   tot_cnt:0  ,
   true_cnt:0,
   error_cnt:0  ,
   start_time:0,
   total_time:0,
   current:0,
   test_count:0,
   sample_fmt:"",

  //Случайное целое в диапазоне
  getRandomArbitrary: function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  } ,
  //текущий момент - в милисекундах
  Now : function() {
    return (new Date()).getTime();
  },
  // инициализируем див игры
  init:function(){
    this.hideAll();
    $('#verb_acc_div_control').show();
  },
  hideAll:function(){
  
    $('#verb_acc_div_control').hide();
  
    $('#verb_acc_div_tst').hide();
    $('#verb_acc_check_res').hide();
    $('#verb_acc_totals').hide();
  },
  //начало игры - показываем див игры и результатов
  start:function(){
    this.hideAll();
    $('#verb_acc_div_tst').show();
 
    $('#verb_acc_check_res').show();

     this.tot_cnt=0;
     this.true_cnt=0;
     this.error_cnt=0;
     this.total_time=0;
     this.current=1;
 
     this.test_count=parseInt($('#verb_acc_cnt').val());
     this.sample_fmt=$("#verb_acc_sample_format").val();
     this.genTest();
     $("#verb_acc_check_res").html("");
     $('#verb_acc_totals').html("");
	 self=this;
	 $('#verb_acc_answer').keydown(function(event)
	   { if (event.which == 13) {
	        event.preventDefault();
	        self.checkTest();
	    }
	   }
	 
	 );
  },


myRand: function (l) {
  switch (l) {
    case 1: return this.getRandomArbitrary(1, 9);
    case 2: return this.getRandomArbitrary(10, 99);
    case 3: return this.getRandomArbitrary(100, 999);
    case 4: return this.getRandomArbitrary(1000, 9999);
    case 5: return this.getRandomArbitrary(10000, 99999);
	}
},  

//Генерируем пример
genTest: function ()
 {
   this.sample="";
   for(i=0;i<this.sample_fmt.length;i++){
     c=this.sample_fmt.charAt(i);
     ind="0123456789".indexOf(""+c);
	 if (ind==-1) {
	   this.sample=this.sample+c;
	 } else {
	   this.sample=this.sample+this.myRand(ind);
	 }
   }


   this.true_ansver=eval(this.sample);
   $('#verb_acc_sample').html(this.sample);    
   $('#verb_acc_answer').val("");
   this.start_time=this.Now();

  
   $('#verb_acc_answer').focus();
},

checkTest: function ()
 {
    var ansver=$('#verb_acc_answer').val();

    cres=$('#verb_acc_check_res');
    cres_html=cres.html();
   this.tot_cnt++;
	
   var calc_time=Math.round((this.Now()-this.start_time)/1000);
   this.total_time+=calc_time;

   var status;
   if (ansver==this.true_ansver) {
     status='OK';
     this.true_cnt++;
   } else {
     status='ERROR';
     this.error_cnt++;
   };    
   
   cres_html+=this.sample+"="+this.true_ansver+" - "+status+" ("+calc_time+" сек)";
   cres_html+='<p>';
   cres.html(cres_html);

   $('#verb_acc_totals').html(
     ' Всего: '+this.tot_cnt+
     ' из: '+this.test_count+
	 ' Правильно: '+this.true_cnt+
	 ' Неправильно: '+this.error_cnt+
	 ' Время полное: '+this.total_time+
	 ' Время среднее: '+Math.round(this.total_time/this.tot_cnt)
    );
	 
	 this.current++;
	 if (this.tot_cnt<this.test_count) {
	   this.genTest();
	   $('#verb_acc_answer').focus();
	 } else {
            this.hideAll();
            $('#verb_acc_div_control').show();
            $('#verb_acc_check_res').show();
            $('#verb_acc_totals').show();
	 }
}


};

