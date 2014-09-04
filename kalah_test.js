(function() {
  var DisplayBoard, Heuristic, Kalah, KalahBoard, KalahSide, MiniMax, NO, Utils, YES, a, getRandomA, getRandomInt, getRandomM;

  NO = 1 === 0;

  YES = 1 === 1;

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

  KalahSide = (function() {
    function KalahSide(cell_count, seed_count, side) {
      this.side = side;
      this.cell_count = cell_count;
      this.seed_count = seed_count;
      this.data = [];
      this.man = 0;
      this.test_board = null;
      this.ind = side === 1 ? function(i) {
        return i - 1;
      } : function(i) {
        return this.cell_count - i;
      };
      this.init();
    }

    KalahSide.prototype.init = function() {
      var i, _i, _ref;
      this.data = [];
      this.man = 0;
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        this.data.push(this.seed_count);
      }
      return this;
    };

    KalahSide.prototype.get_cell = function(c) {
      return this.data[this.ind(c)];
    };

    KalahSide.prototype.set_cell = function(c, v) {
      return this.data[this.ind(c)] = v;
    };

    KalahSide.prototype.inc_cell = function(c) {
      return ++this.data[this.ind(c)];
    };

    KalahSide.prototype.extract_cell = function(c) {
      var res;
      res = this.data[this.ind(c)];
      this.data[this.ind(c)] = 0;
      return res;
    };

    KalahSide.prototype.fill = function(b) {
      var i, _i, _ref;
      b.man = this.man;
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        b.data[i - 1] = this.data[i - 1];
      }
      return this;
    };

    return KalahSide;

  })();

  KalahBoard = (function() {
    function KalahBoard(cell_count, seed_count, continue_move) {
      this.cell_count = cell_count;
      this.seed_count = seed_count;
      this.field = [];
      this.field[1] = new KalahSide(cell_count, seed_count, 1);
      this.field[2] = new KalahSide(cell_count, seed_count, 2);
      this.continue_move = continue_move;
      this.gover = NO;
    }

    KalahBoard.prototype.template = function() {
      return new KalahBoard(this.cell_count, 0, this.continue_move);
    };

    KalahBoard.prototype.fill = function(b) {
      this.field[1].fill(b.field[1]);
      this.field[2].fill(b.field[2]);
      b.continue_move = this.continue_move;
      return b.gover = this.gover;
    };

    KalahBoard.prototype.init = function() {
      this.gover = NO;
      this.field[1].init();
      return this.field[2].init();
    };

    KalahBoard.prototype.do_move = function(m, side) {
      var z, _i, _len;
      for (_i = 0, _len = m.length; _i < _len; _i++) {
        z = m[_i];
        this.move(side, z);
      }
      return this.check_gover();
    };

    KalahBoard.prototype.check_gover = function() {
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

    KalahBoard.prototype.post_game_over = function(side) {
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

    KalahBoard.prototype.move = function(side, cell) {
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

    KalahBoard.prototype.gameOver = function(side) {
      return this.gover;
    };

    KalahBoard.prototype.possibleMoves = function(side) {
      return this.possibleMoves_r(side, 100);
    };

    KalahBoard.prototype.possibleMoves_r = function(side, d) {
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
          done = this.test_board.move(side, [i]);
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

    return KalahBoard;

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

  MiniMax = (function() {
    function MiniMax(depth) {
      this.heur = new Heuristic();
      this.depth = depth;
      this.boards = [];
      this.inf_minus = this.heur.inf_minus;
      this.inf_plus = this.heur.inf_plus;
      this.fullscan = YES;
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
      var b, b2, best_moves, curr_rate, m, mopp, opp, r, res, res_rate, rez_rate, rr, z, zz, _i, _j, _len, _len1, _ref;
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
      b = this.newBoard(board);
      b2 = this.newBoard(board);
      res_rate = this.inf_minus;
      best_moves = [];
      z = this.heur.pre_filter(board, side, board.possibleMoves(side));
      rez_rate = this.inf_minus;
      for (_i = 0, _len = z.length; _i < _len; _i++) {
        m = z[_i];
        if (rez_rate < alpha || this.fullscan) {
          board.fill(b);
          b.do_move(m, side);
          if (b.gover || depth === 1) {
            curr_rate = this.heur.rate(board, side);
          } else {
            r = this.inf_plus;
            zz = b.possibleMoves(opp);
            _ref = zz.sort(this.heur.sf());
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              mopp = _ref[_j];
              if (r > res_rate || this.fullscan) {
                b.fill(b2);
                b2.do_move(mopp, opp);
                rr = this.mx_mn(b2, side, r, depth - 2).rate;
                if (rr < r) {
                  r = rr;
                }
              }
            }
            curr_rate = r;
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
      this.cnt = 0;
      return this.mx_mn(board, side, this.inf_plus, this.depth).moves;
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
      this.after_move = void 0;
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
      return "Game Over! " + this.board.field[1].man + ':' + this.board.field[2].man;
    };

    DisplayBoard.prototype.onCellClick = function(i) {
      var done, finish, log_mess, mess;
      if (!this.enabled) {
        return;
      }
      finish = NO;
      if (this.board.field[1].get_cell(i) === 0) {
        alert("Пустая ячейка");
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
          alert(mess);
          finish = YES;
        } else {
          if (this.board.gover) {
            alert("Game Over!");
            finish = YES;
          }
        }
      }
      this.draw();
      if (finish) {
        return;
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
          this.nord_moves.push(z);
        }
      }
      if (this.board.gameOver(1)) {
        this.board.post_game_over(1);
        this.draw();
        alert(this.gover_msg());
      }
      if (this.after_move != null) {
        this.after_move();
      }
      return this.draw();
    };

    return DisplayBoard;

  })();

  Kalah = (function() {
    function Kalah() {
      this.board = new KalahBoard(8, 6);
    }

    Kalah.prototype.newGame = function(cell, seed, depth, cont_move, full_scan) {
      this.board = new KalahBoard(cell, seed, cont_move === 1);
      this.display_board.set_board(this.board);
      this.div_b.html(' ');
      this.div_b.append(this.display_board.tbl);
      this.display_board.draw();
      this.display_board.alg.depth = depth;
      this.display_board.alg.fullscan = full_scan === 1;
      return this.div_hist.html('');
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
      return this.span_info.html('Север ходит ' + this.display_board.nord_moves.join(',') + '  Просмотрено позиций ' + this.display_board.alg.cnt + ' Глубина  ' + this.display_board.alg.depth);
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

    Kalah.prototype.init = function() {
      var btnInit, divctrl, f, fngc, r, styleWOBord, t;
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
      divctrl = $('<div></div>').appendTo($('#root'));
      btnInit = $('<button>Новая игра</button>').appendTo(divctrl);
      $('<p></p>').appendTo(divctrl);
      styleWOBord = {
        "border-top": "none",
        "border-bottom": "none",
        "border-left": "none",
        "border-right": "none",
        "padding": "0px"
      };
      t = this.html_table().css(styleWOBord).appendTo(divctrl);
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
      this.html_opt(this.selDepth, 4, 4);
      this.html_opt(this.selDepth, 5, 5);
      this.html_opt(this.selDepth, 6, 6).attr("selected", "selected");
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
      $('<p></p>').appendTo(divctrl);
      this.span_info = $('<span></span>').appendTo(divctrl);
      f = $('<font size="7"></font>').appendTo($('#root'));
      this.div_b = $('<div></div>').appendTo(f);
      this.div_hist = $('<p></p>').appendTo($('#root'));
      this.div_hist = $('<p>История</p>').appendTo($('#root'));
      this.div_hist = $('<div></div>').appendTo($('#root'));
      this.newGame(6, 6, 6, 1, 1);
      fngc = (function(_this) {
        return function() {
          var cc, cm, d, fs, sc;
          cc = parseInt(_this.selCell.val());
          sc = parseInt(_this.selSeed.val());
          d = parseInt(_this.selDepth.val());
          cm = parseInt(_this.selContMove.val());
          fs = parseInt(_this.selFullScan.val());
          return _this.newGame(cc, sc, d, cm, fs);
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
