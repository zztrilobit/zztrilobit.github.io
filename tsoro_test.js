(function() {
  var AlfaBeta, DisplayBoard, Heuristic, INNER, Kalah, MiniMax, NO, OUTER, TsoroBoard, TsoroSide, Utils, YES, a, getRandomA, getRandomInt, getRandomM;

  NO = 1 === 0;

  YES = 1 === 1;

  INNER = 1;

  OUTER = 2;

  Utils = (function() {
    function Utils() {
      this.styleWOBord = {
        "border-top": "none",
        "border-bottom": "none",
        "border-left": "none",
        "border-right": "none",
        "padding": "0px"
      };
    }

    return Utils;

  })();

  TsoroSide = (function() {
    function TsoroSide(cell_count, seed_count, side) {
      this.side = side;
      this.cell_count = cell_count;
      this.seed_count = seed_count;
      this.data_inner = [];
      this.data_outer = [];
      this.dt = [];
      this.dt[INNER] = this.data_inner;
      this.dt[OUTER] = this.data_outer;
      this.man = 0;
      this.test_board = null;
      this.ind = side === 1 ? function(i) {
        return i - 1;
      } : function(i) {
        return this.cell_count - i;
      };
      this.init();
    }

    TsoroSide.prototype.init = function() {
      var i, _i, _ref;
      this.data_inner = [];
      this.data_outer = [];
      this.dt = [];
      this.dt[INNER] = this.data_inner;
      this.dt[OUTER] = this.data_outer;
      this.man = 0;
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        this.data_inner.push(this.seed_count);
        this.data_outer.push(this.seed_count);
      }
      return this;
    };

    TsoroSide.prototype.get_cell = function(c, r) {
      return this.dt[r][this.ind(c)];
    };

    TsoroSide.prototype.set_cell = function(c, r, v) {
      return this.dt[r][this.ind(c)] = v;
    };

    TsoroSide.prototype.inc_cell = function(c, r) {
      return ++this.dt[r][this.ind(c)];
    };

    TsoroSide.prototype.extract_cell = function(c, r) {
      var res;
      res = this.dt[r][this.ind(c)];
      this.dt[r][this.ind(c)] = 0;
      return res;
    };

    TsoroSide.prototype.fill = function(b) {
      var i, _i, _ref;
      b.man = this.man;
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        b.data_inner[i - 1] = this.data_inner[i - 1];
        b.data_outer[i - 1] = this.data_outer[i - 1];
      }
      return this;
    };

    return TsoroSide;

  })();

  TsoroBoard = (function() {
    function TsoroBoard(cell_count, seed_count, continue_move) {
      this.cell_count = cell_count;
      this.seed_count = seed_count;
      this.field = [];
      this.field[1] = new TsoroSide(cell_count, seed_count, 1);
      this.field[2] = new TsoroSide(cell_count, seed_count, 2);
      this.continue_move = continue_move;
      this.gover = NO;
    }

    TsoroBoard.prototype.template = function() {
      return new TsoroBoard(this.cell_count, 0, this.continue_move);
    };

    TsoroBoard.prototype.fill = function(b) {
      this.field[1].fill(b.field[1]);
      this.field[2].fill(b.field[2]);
      b.continue_move = this.continue_move;
      return b.gover = this.gover;
    };

    TsoroBoard.prototype.init = function() {
      this.gover = NO;
      this.field[1].init();
      return this.field[2].init();
    };

    TsoroBoard.prototype.do_move = function(m, side) {
      var z, _i, _len;
      for (_i = 0, _len = m.length; _i < _len; _i++) {
        z = m[_i];
        this.move(side, z);
      }
      return this.check_gover();
    };

    TsoroBoard.prototype.check_gover = function() {
      var i, s1, s2, _i, _j, _ref, _ref1, _results;
      s1 = 0;
      s2 = 0;
      for (i = _i = 0, _ref = this.cell_count - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        s1 += this.field[1].data[i];
        s2 += this.field[2].data[i];
      }
      if ((s1 === 0) || (s2 === 0)) {
        this.gover = YES;
        this.field[1].man += s1;
        this.field[2].man += s2;
        _results = [];
        for (i = _j = 0, _ref1 = this.cell_count - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          this.field[1].data[i] = 0;
          _results.push(this.field[2].data[i] = 0);
        }
        return _results;
      }
    };

    TsoroBoard.prototype.post_game_over = function(side) {
      var i, _i, _ref, _results;
      if (this.gameOver(side)) {
        _results = [];
        for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          this.field[1].man += this.field[1].extract_cell(i);
          _results.push(this.field[2].man += this.field[2].extract_cell(i));
        }
        return _results;
      }
    };

    TsoroBoard.prototype.move = function(side, cell) {
      var curr_cnt, curr_side, done, n, next_point, res, z;
      res = {};
      n = this.field[side].extract_cell(cell);
      next_point = cell + 1;
      curr_side = side;
      res = YES;
      while (n-- > 0) {
        done = NO;
        if (next_point === this.cell_count + 1) {
          if (curr_side === side) {
            this.field[side].man++;
            done = YES;
            res = NO;
          }
          curr_side = 3 - curr_side;
          next_point = 1;
        }
        if (!done && next_point <= this.cell_count) {
          curr_cnt = this.field[curr_side].inc_cell(next_point);
          res = YES;
          if (n === 0 && side === curr_side) {
            if (curr_cnt > 1) {
              if (this.continue_move) {
                n = this.field[curr_side].extract_cell(next_point);
              }
            } else {
              z = this.field[3 - side].extract_cell(this.cell_count - next_point + 1);
              if (z > 0) {
                this.field[curr_side].man += z + 1;
                this.field[curr_side].extract_cell(next_point);
              }
            }
          }
          next_point++;
        }
      }
      return res;
    };

    TsoroBoard.prototype.gameOver = function(side) {
      return this.gover;
    };

    TsoroBoard.prototype.possibleMoves = function(side) {
      return this.possibleMoves_r(side, 100);
    };

    TsoroBoard.prototype.possibleMoves_r = function(side, d) {
      var done, i, m, r, res, z, _i, _j, _k, _len, _len1, _ref, _ref1;
      if (d <= 0) {
        alert('0');
      }
      if (this.test_board == null) {
        this.test_board = this.template();
      }
      res = [];
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        if (this.field[side].get_cell(i) > 0) {
          this.fill(this.test_board);
          done = this.test_board.move(side, i);
          this.test_board.check_gover();
          if ((!done) && (!this.test_board.gover)) {
            _ref1 = this.test_board.possibleMoves_r(side, d - 1);
            for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
              m = _ref1[_j];
              r = [i];
              for (_k = 0, _len1 = m.length; _k < _len1; _k++) {
                z = m[_k];
                r.push(z);
              }
              res.push(r);
            }
          } else {
            res.push([i]);
          }
        }
      }
      return res;
    };

    return TsoroBoard;

  })();

  getRandomInt = function(mn, mx) {
    return Math.floor(Math.random() * (mx - mn + 1)) + mn;
  };

  getRandomA = function(a) {
    return a[getRandomInt(0, a.length - 1)];
  };

  getRandomM = function(a) {
    var res;
    if (a.length > 0) {
      res = a[getRandomInt(0, a.length - 1)];
      res.not_found = 1 === 0;
    } else {
      res = {
        x: 0,
        y: 0,
        flips: []
      };
      res.not_found = 1 === 1;
    }
    return res;
  };

  Heuristic = (function() {
    function Heuristic() {
      this.inf_minus = -10000;
      this.inf_plus = 10000;
    }

    Heuristic.prototype.sf = function() {
      return (function(a, b) {
        return 0;
      });
    };

    Heuristic.prototype.pre_filter = function(board, side, pm) {
      return pm;
    };

    Heuristic.prototype.rate = function(board, side) {
      var i, o, s, _i, _ref;
      if (!board.gameOver(side)) {
        return board.field[side].man - board.field[3 - side].man;
      } else {
        s = board.field[side].man;
        o = board.field[3 - side].man;
        for (i = _i = 0, _ref = board.cell_count - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          s += board.field[side].data[i];
          o += board.field[3 - side].data[i];
        }
        if (s >= o) {
          return this.inf_plus;
        } else {
          return this.inf_minus;
        }
      }
    };

    return Heuristic;

  })();

  AlfaBeta = (function() {
    function AlfaBeta(depth) {
      this.heur = new Heuristic();
      this.depth = depth;
      this.boards = [];
      this.inf_minus = this.heur.inf_minus;
      this.inf_plus = this.heur.inf_plus;
      this.fullscan = YES;
    }

    AlfaBeta.prototype.newBoard = function(t) {
      if (this.boards.length > 0) {
        return this.boards.pop();
      } else {
        return t.template();
      }
    };

    AlfaBeta.prototype.reuse_board = function(b) {
      return this.boards.push(b);
    };


    /*
    integer procedure F2(ref(position) p,integer alpha,integer beta): 
    begin integer m,t; ref(position) q; 
    generate(p); 
    q := first(p); 
    if q = NULL then F2 := f(p) else 
    begin m := alpha; 
     while q <> NULL and m < beta do 
      begin t := -F2(q, -beta, -m); if t > m then m := t; q := next(q); 
      end; 
     F2 := m; 
    end; 
    end. */

    AlfaBeta.prototype.ABPrun = function(board, side, a, b, depth) {
      var best_moves, brd, m, opp, r, res, res_rate, z, _i, _len;
      this.cnt++;
      opp = side === 1 ? 2 : 1;
      res = {
        rate: 0
      };
      res.best_moves = [];
      if (depth <= 0 || board.gameOver(side)) {
        res.rate = this.heur.rate(board, side);
        res.moves = [];
        return res;
      }
      brd = this.newBoard(board);
      res_rate = this.inf_minus;
      best_moves = [];
      z = this.heur.pre_filter(board, side, board.possibleMoves(side));
      res_rate = a;
      for (_i = 0, _len = z.length; _i < _len; _i++) {
        m = z[_i];
        if (res_rate < b) {
          board.fill(brd);
          brd.do_move(m, side);
          if (brd.gover) {
            r = this.heur.rate(brd, side);
          } else {
            r = -this.ABPrun(brd, opp, -b, -res_rate, depth - 1);
          }
          if (r > res_rate) {
            res_rate = r;
          }
        }
      }
      return res_rate;
    };

    AlfaBeta.prototype.bestMoves = function(board, side) {
      var best_moves, brd, m, opp, r, res_rate, result, z, _i, _len;
      this.cnt = 0;
      opp = 3 - side;
      if (board.gover) {
        return [];
      }
      brd = this.newBoard(board);
      res_rate = this.inf_minus;
      best_moves = [];
      z = this.heur.pre_filter(board, side, board.possibleMoves(side));
      res_rate = this.inf_minus;
      result = [];
      for (_i = 0, _len = z.length; _i < _len; _i++) {
        m = z[_i];
        board.fill(brd);
        brd.do_move(m, side);
        if (brd.gover) {
          r = this.heur.rate(brd, side);
        } else {
          r = -this.ABPrun(brd, opp, this.inf_plus, this.inf_minus, this.depth - 1);
        }
        if (r > res_rate) {
          result = [];
          res_rate = r;
        }
        if (r === res_rate) {
          result.push(m);
        }
      }
      return result;
    };

    AlfaBeta.prototype.findAnyMove = function(board, side) {
      return getRandomM(this.bestMoves(board, side));
    };

    return AlfaBeta;

  })();

  MiniMax = (function() {
    function MiniMax(depth) {
      this.heur = new Heuristic();
      this.depth = depth;
      this.boards = [];
      this.inf_minus = this.heur.inf_minus;
      this.inf_plus = this.heur.inf_plus;
      this.fullscan = NO;
      this.test_full_scan1 = YES;
      this.test_full_scan2 = NO;
      this.break_by_cnt = YES;
      this.break_cnt = 25000;
    }

    MiniMax.prototype.newBoard = function(t) {
      if (this.boards.length > 0) {
        return this.boards.pop();
      } else {
        return t.template();
      }
    };

    MiniMax.prototype.reuse_board = function(b) {
      return this.boards.push(b);
    };

    MiniMax.prototype.mx_mn = function(board, side, alpha, depth) {
      var b, b2, best_moves, curr_fs_rate, curr_rate, m, mopp, opp, r, res, res_rate, rez_rate, rr, z, zz, _i, _j, _len, _len1, _ref;
      this.cnt++;
      opp = side === 1 ? 2 : 1;
      res = {
        rate: 0
      };
      res.best_moves = [];
      res.broken = NO;
      if (this.break_by_cnt && (this.cnt > this.break_cnt)) {
        this.broken = YES;
        return res;
      }
      if (depth <= 0 || board.gameOver(side)) {
        res.rate = this.heur.rate(board, side);
        res.moves = [];
        return res;
      }
      b = this.newBoard(board);
      b2 = this.newBoard(board);
      res_rate = this.inf_minus;
      best_moves = [];
      z = this.heur.pre_filter(board, side, board.possibleMoves(side));
      rez_rate = this.inf_minus;
      for (_i = 0, _len = z.length; _i < _len; _i++) {
        m = z[_i];
        if (rez_rate < alpha) {
          board.fill(b);
          b.do_move(m, side);
          if (b.gover || depth === 1) {
            curr_rate = this.heur.rate(board, side);
            curr_fs_rate = curr_rate;
          } else {
            r = this.inf_plus;
            zz = b.possibleMoves(opp);
            _ref = zz.sort(this.heur.sf());
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              mopp = _ref[_j];
              if (r >= res_rate) {
                b.fill(b2);
                b2.do_move(mopp, opp);
                rr = this.mx_mn(b2, side, r, depth - 2).rate;

                /*
                if @test_full_scan1 
                    b.fill(b2)
                    b2.do_move(mopp,opp)
                    rrfs=@mx_mn(b2,side,@inf_plus+10,depth-2).rate
                    if rrfs<r and rr>=r
                         * фуллскан вернул другое!
                        alert 'TreeBug1' */
                if (rr < r) {
                  r = rr;
                }
              }
            }
            curr_rate = r;

            /*
            if @test_full_scan2
                r=@inf_plus
                zz=b.possibleMoves(opp)
                for mopp in zz.sort(@heur.sf())
                    b.fill(b2)
                    b2.do_move(mopp,opp)
                     * если в следующей итерации встретим ветку больше тетущей, прекратим перебор
                    rr=@mx_mn(b2,side,r,depth-2).rate
                    r=rr if rr<r
                curr_fs_rate=r */
          }
          if (curr_rate > res_rate) {
            best_moves = [];
            res_rate = curr_rate;
          }
          if (curr_rate === res_rate) {
            best_moves.push(m);
          }
        }
      }
      res.rate = res_rate;
      res.moves = best_moves;
      this.reuse_board(b);
      this.reuse_board(b2);
      return res;
    };

    MiniMax.prototype.bestMoves = function(board, side) {
      var d, done, res;
      if (!this.break_by_cnt) {
        this.cnt = 0;
        d = this.depth;
        this.eff_depth = d;
        res = this.mx_mn(board, side, this.inf_plus, d);
        return res.moves;
      } else {
        d = this.depth;
        done = NO;
        while (!done) {
          this.cnt = 0;
          this.broken = NO;
          res = this.mx_mn(board, side, this.inf_plus, d);
          if (this.broken) {
            d--;
          } else {
            done = YES;
          }
        }
        this.eff_depth = d;
        return res.moves;
      }
    };

    MiniMax.prototype.findAnyMove = function(board, side) {
      return getRandomM(this.bestMoves(board, side));
    };

    return MiniMax;

  })();

  DisplayBoard = (function() {
    function DisplayBoard() {
      this.u = new Utils();
      this.alg = new MiniMax(4);
      this.nord_moves = [];
      this.enabled = YES;
      this.busy = NO;
      this.on_info = void 0;
      this.after_move = void 0;
      this.after_gover = void 0;
      this.after_busy = void 0;
      this.log_hist = void 0;
    }

    DisplayBoard.prototype.set_board = function(board) {
      var fld, i, nCell, r1, rn, rni, rs, rsi, sCell, styleBody, styleHdr, styleMan, t2, _i, _ref;
      this.board = board;
      this.cell_count = board.cell_count;
      this.tbl = $('<table></table>').css(this.u.styleWOBord).css('cellspasing', 5);
      this.cell_count = board.cell_count;
      r1 = $('<tr></tr>').appendTo(this.tbl);
      styleMan = {
        valign: "middle",
        "text-align": "center",
        width: 60,
        "font-size": "xx-large",
        "font-weight": "bold"
      };
      this.nMan = $('<td></td>').appendTo(r1).css(styleMan);
      fld = $('<td></td>').appendTo(r1).css(this.u.styleWOBord);
      this.sMan = $('<td></td>').appendTo(r1).css(styleMan);
      t2 = $('<table></table>').css(this.u.styleWOBord).css({
        "border-collapse": "collapse",
        "border": "1"
      }).appendTo(fld);
      rni = $('<tr></tr>').appendTo(t2);
      rn = $('<tr></tr>').appendTo(t2);
      rs = $('<tr></tr>').appendTo(t2);
      rsi = $('<tr></tr>').appendTo(t2);
      this.nFields = [];
      this.sFields = [];
      styleHdr = {
        valign: "middle",
        "text-align": "center",
        width: 60,
        height: 30
      };
      styleBody = {
        valign: "middle",
        "text-align": "center",
        width: 60,
        height: 60,
        "font-size": "xx-large",
        "border-top": "solid",
        "border-bottom": "solid",
        "border-left": "solid",
        "border-right": "solid",
        "border": "1px solid black",
        "padding": "0px"
      };
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        nCell = $('<td></td>').appendTo(rn).css(styleBody);
        this.nFields.push(nCell);
        sCell = $('<td></td>').appendTo(rs).css(styleBody);
        this.sFields.push(sCell);
        if (this.enabled) {
          sCell.click(this.clicker(i));
        }
        $('<td>' + i + '</td>').appendTo(rni).css(styleHdr);
        $('<td >' + (this.cell_count - i + 1) + '</td>').css(styleHdr).appendTo(rsi);
      }
      return this.draw();
    };

    DisplayBoard.prototype.draw = function() {
      var i, _i, _ref, _results;
      this.nMan.html(this.board.field[2].man);
      this.sMan.html(this.board.field[1].man);
      _results = [];
      for (i = _i = 0, _ref = this.board.cell_count - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.nFields[i].html(this.board.field[2].data[i]);
        _results.push(this.sFields[i].html(this.board.field[1].data[i]));
      }
      return _results;
    };

    DisplayBoard.prototype.clicker = function(i) {
      return (function(_this) {
        return function() {
          return _this.onCellClick(i);
        };
      })(this);
    };

    DisplayBoard.prototype.gover_msg = function() {
      return "Game Over! " + this.board.field[2].man + ':' + this.board.field[1].man;
    };

    DisplayBoard.prototype.onInfo = function() {
      if (typeof on_info !== "undefined" && on_info !== null) {
        return on_info();
      }
    };

    DisplayBoard.prototype.onCellClick = function(i) {
      var done, finish, log_mess, mess;
      if (!this.enabled) {
        return;
      }
      if (this.busy) {
        this.onInfo('Идет расчет');
        return;
      }
      finish = NO;
      if (this.board.field[1].get_cell(i) === 0) {
        this.onInfo("Пустая ячейка");
        return;
      } else {
        if (this.log_hist != null) {
          this.log_hist(1, i);
        }
        done = this.board.move(1, i);
        this.board.check_gover();
        if (!done) {
          log_mess = "Ход юга " + (this.board.cell_count - i + 1);
          mess = this.board.gover ? this.gover_msg() : "Ходите дальше!";
          if (this.board.gover) {
            if (this.after_gover != null) {
              this.after_gover();
            }
          }
          this.onInfo(mess);
          finish = YES;
        } else {
          if (this.board.gover) {
            this.onInfo(this.gover_msg());
            finish = YES;
            if (this.after_gover != null) {
              this.after_gover();
            }
          }
        }
      }
      this.draw();
      if (finish) {
        return;
      }
      this.busy = YES;
      if (this.after_busy != null) {
        this.after_busy();
      }
      return setTimeout(((function(_this) {
        return function() {
          return _this.robot();
        };
      })(this)), 100);
    };

    DisplayBoard.prototype.robot = function() {
      var m, moves, pm, z, _i, _j, _len, _len1;
      pm = this.board.possibleMoves(2);
      if (pm.length > 0) {
        moves = this.alg.findAnyMove(this.board, 2);
        if (moves.length === 0) {
          moves = getRandomA(pm);
        }
        for (_i = 0, _len = moves.length; _i < _len; _i++) {
          m = moves[_i];
          if (this.log_hist != null) {
            this.log_hist(2, m);
          }
          this.board.do_move([m], 2);
        }
        this.nord_moves = [];
        for (_j = 0, _len1 = moves.length; _j < _len1; _j++) {
          z = moves[_j];
          this.nord_moves.push(this.board.cell_count - z + 1);
        }
      }
      if (this.board.gameOver(1)) {
        this.board.post_game_over(1);
        this.draw();
        if (this.after_gover != null) {
          this.after_gover();
        }
        this.onInfo(this.gover_msg());
      }
      if (this.after_move != null) {
        this.after_move();
      }
      if (this.board.gameOver(1)) {
        this.onInfo(this.gover_msg());
      }
      this.busy = NO;
      return this.draw();
    };

    return DisplayBoard;

  })();

  Kalah = (function() {
    function Kalah() {
      this.board = new KalahBoard(8, 6);
      this.init_cnt();
    }

    Kalah.prototype.init_cnt = function() {
      this.cn_robot = 0;
      return this.cn_man = 0;
    };

    Kalah.prototype.newGame = function(cell, seed, depth, cont_move, full_scan, first_step) {
      this.board = new KalahBoard(cell, seed, cont_move === 1);
      this.display_board.set_board(this.board);
      this.div_b.html(' ');
      this.div_b.append(this.display_board.tbl);
      this.display_board.draw();
      this.display_board.alg.depth = depth;
      this.display_board.alg.fullscan = full_scan === 1;
      this.div_hist.html('');
      if (first_step === 2) {
        return this.display_board.robot();
      }
    };

    Kalah.prototype.html_sel = function() {
      return $('<select><select>');
    };

    Kalah.prototype.html_opt = function(sel, key, val) {
      return $('<option value="' + val + '">' + key + '</option>').appendTo(sel);
    };

    Kalah.prototype.html_table = function() {
      return $('<table></table>');
    };

    Kalah.prototype.html_tr = function(tbl) {
      return $('<tr></tr>').appendTo(tbl);
    };

    Kalah.prototype.html_td = function(tr) {
      return $('<td></td>').appendTo(tr);
    };

    Kalah.prototype.html_opt = function(sel, key, val) {
      return $('<option value="' + val + '">' + key + '</option>').appendTo(sel);
    };

    Kalah.prototype.info = function() {
      return this.span_info.html('Север ходит ' + this.display_board.nord_moves.join(',') + '  Просмотрено позиций ' + this.display_board.alg.cnt + ' Глубина  ' + this.display_board.alg.eff_depth);
    };

    Kalah.prototype.after_busy = function() {
      return this.span_info.html('... задумался ....');
    };

    Kalah.prototype.onInfo = function(i) {
      return this.span_info.html(i);
    };

    Kalah.prototype.log_hist = function(side, cell) {
      var b, color, d, m;
      b = this.board.template();
      this.board.fill(b);
      this.db2.set_board(b);
      color = side === 1 ? "#b0c4de" : "#c4b0de";
      d = $("<div></div>").css("background-color", color);
      m = "Ход " + (side === 1 ? "юга" : "севера") + " " + (this.board.cell_count - cell + 1);
      d.append("<p>" + m + "</p>");
      d.append(this.db2.tbl);
      return this.div_hist.prepend(d);
    };

    Kalah.prototype.after_gover = function() {
      if (this.board.field[1].man > this.board.field[2].man) {
        this.cn_man++;
      }
      if (this.board.field[2].man > this.board.field[1].man) {
        this.cn_robot++;
      }
      return this.span_cnt.html('Счет (север:юг) ' + this.cn_robot + ":" + this.cn_man);
    };

    Kalah.prototype.init = function() {
      var btnInit, btnOpts, divctrl, f, fngc, r, styleWOBord, t;
      this.display_board = new DisplayBoard(this.board);
      this.display_board.log_hist = (function(_this) {
        return function(side, cell) {
          return _this.log_hist(side, cell);
        };
      })(this);
      this.db2 = new DisplayBoard(this.board);
      this.db2.enabled = NO;
      this.display_board.after_move = (function(_this) {
        return function() {
          return _this.info();
        };
      })(this);
      this.display_board.after_gover = (function(_this) {
        return function() {
          return _this.after_gover();
        };
      })(this);
      this.display_board.after_busy = (function(_this) {
        return function() {
          return _this.after_busy();
        };
      })(this);
      this.display_board.onInfo = (function(_this) {
        return function(i) {
          return _this.onInfo(i);
        };
      })(this);
      divctrl = $('<div></div>').appendTo($('#root'));
      btnInit = $('<button>Новая игра</button>').appendTo(divctrl);
      btnOpts = $('<button>Настройки....</button>').appendTo(divctrl).click((function(_this) {
        return function() {
          return _this.opts.toggle();
        };
      })(this));
      $('<p></p>').appendTo(divctrl);
      styleWOBord = {
        "border-top": "none",
        "border-bottom": "none",
        "border-left": "none",
        "border-right": "none",
        "padding": "0px"
      };
      t = this.html_table().hide().css(styleWOBord).appendTo(divctrl);
      this.opts = t;
      r = this.html_tr(t);
      this.html_td(r).css(styleWOBord).html('Лунок');
      this.selCell = this.html_sel().appendTo(this.html_td(r).css(styleWOBord));
      this.html_opt(this.selCell, 4, 4);
      this.html_opt(this.selCell, 6, 6).attr("selected", "selected");
      this.html_opt(this.selCell, 8, 8);
      r = this.html_tr(t);
      this.html_td(r).css(styleWOBord).html('Камней');
      this.selSeed = this.html_sel().appendTo(this.html_td(r).css(styleWOBord));
      this.html_opt(this.selSeed, 3, 3);
      this.html_opt(this.selSeed, 4, 4);
      this.html_opt(this.selSeed, 5, 5);
      this.html_opt(this.selSeed, 6, 6).attr("selected", "selected");
      r = this.html_tr(t);
      this.html_td(r).css(styleWOBord).html('Глубина просмотра');
      this.selDepth = this.html_sel().appendTo(this.html_td(r).css(styleWOBord));
      this.html_opt(this.selDepth, 3, 3);
      this.html_opt(this.selDepth, 4, 4).attr("selected", "selected");
      this.html_opt(this.selDepth, 5, 5);
      this.html_opt(this.selDepth, 6, 6);
      r = this.html_tr(t);
      this.html_td(r).css(styleWOBord).html('Продолжить посев');
      this.selContMove = this.html_sel().appendTo(this.html_td(r).css(styleWOBord));
      this.html_opt(this.selContMove, 'Да', 1).attr("selected", "selected");
      this.html_opt(this.selContMove, "Нет", 2);
      r = this.html_tr(t);
      this.html_td(r).css(styleWOBord).html('Полный перебор');
      this.selFullScan = this.html_sel().appendTo(this.html_td(r).css(styleWOBord));
      this.html_opt(this.selFullScan, 'Да', 1).attr("selected", "selected");
      this.html_opt(this.selFullScan, "Нет", 2);
      r = this.html_tr(t);
      this.html_td(r).css(styleWOBord).html('Первый ход');
      this.selFirstStep = this.html_sel().appendTo(this.html_td(r).css(styleWOBord));
      this.html_opt(this.selFirstStep, 'Человек', 1).attr("selected", "selected");
      this.html_opt(this.selFirstStep, "Робот", 2);
      $('<p></p>').appendTo(divctrl);
      this.span_cnt = $('<span></span>').appendTo(divctrl);
      $('<p></p>').appendTo(divctrl);
      this.span_info = $('<span></span>').appendTo(divctrl);
      f = $('<font size="7"></font>').appendTo($('#root'));
      this.div_b = $('<div></div>').appendTo(f);
      this.div_hist = $('<p></p>').appendTo($('#root'));
      this.div_hist = $('<p>История</p>').appendTo($('#root'));
      this.div_hist = $('<div></div>').appendTo($('#root'));
      this.newGame(6, 6, 4, 1, 1, 1);
      fngc = (function(_this) {
        return function() {
          var cc, cm, d, firstStep, fs, sc;
          cc = parseInt(_this.selCell.val());
          sc = parseInt(_this.selSeed.val());
          d = parseInt(_this.selDepth.val());
          cm = parseInt(_this.selContMove.val());
          fs = parseInt(_this.selFullScan.val());
          firstStep = parseInt(_this.selFirstStep.val());
          return _this.newGame(cc, sc, d, cm, fs, firstStep);
        };
      })(this);
      return btnInit.click(fngc);
    };

    return Kalah;

  })();

  a = new Kalah;

  $(document).ready(function() {
    return a.init();
  });

}).call(this);
