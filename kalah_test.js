(function() {
  var DisplayBoard, Heuristic, Kalah, KalahBoard, KalahSide, MiniMax, NO, YES, a, getRandomA, getRandomInt, getRandomM;

  NO = 1 === 0;

  YES = 1 === 1;

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
      var i, _i, _ref, _results;
      this.data = [];
      this.man = 0;
      _results = [];
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        _results.push(this.data.push(this.seed_count));
      }
      return _results;
    };

    KalahSide.prototype.get_cell = function(c) {
      return this.data[this.ind(c)];
    };

    KalahSide.prototype.set_cell = function(c, v) {
      return this.data[this.ind(c)] = v;
    };

    KalahSide.prototype.inc_cell = function(c) {
      return this.data[this.ind(c)]++;
    };

    KalahSide.prototype.extract_cell = function(c) {
      var res;
      res = this.data[this.ind(c)];
      this.data[this.ind(c)] = 0;
      return res;
    };

    KalahSide.prototype.fill = function(b) {
      var i, _i, _ref, _results;
      b.man = this.man;
      _results = [];
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        _results.push(b.data[i - 1] = this.data[i]);
      }
      return _results;
    };

    return KalahSide;

  })();

  KalahBoard = (function() {
    function KalahBoard(cell_count, seed_count) {
      this.cell_count = cell_count;
      this.seed_count = seed_count;
      this.field = [];
      this.field[1] = new KalahSide(cell_count, seed_count, 1);
      this.field[2] = new KalahSide(cell_count, seed_count, 2);
    }

    KalahBoard.prototype.template = function() {
      return new KalahBoard(this.cell_count, 0);
    };

    KalahBoard.prototype.fill = function(b) {
      this.field[1].fill(b.field[1]);
      return this.field[2].fill(b.field[2]);
    };

    KalahBoard.prototype.init = function() {
      this.field[1].init();
      return this.field[2].init();
    };

    KalahBoard.prototype.do_move = function(m, side) {
      var z, _i, _len;
      for (_i = 0, _len = m.length; _i < _len; _i++) {
        z = m[_i];
        this.move(side, z);
      }
      return this.post_game_over();
    };

    KalahBoard.prototype.post_game_over = function() {
      var i, _i, _ref, _results;
      if (this.gameOver()) {
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
              n = this.field[curr_side].extract_cell(next_point);
            } else {
              z = this.field[3 - side].extract_cell(this.cell_count - next_point + 1);
              this.field[side].man += z;
            }
          }
          next_point++;
        }
      }
      return res;
    };

    KalahBoard.prototype.gameOver = function() {
      var a1, a2, i, _i, _ref;
      a1 = YES;
      a2 = YES;
      for (i = _i = 0, _ref = this.cell_count - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.field[1].data[i] > 0) {
          a1 = NO;
        }
        if (this.field[2].data[i] > 0) {
          a2 = NO;
        }
      }
      return a1 || a2;
    };

    KalahBoard.prototype.possibleMoves = function(side) {
      return this.possibleMoves_r(side, 100);
    };

    KalahBoard.prototype.possibleMoves_r = function(side, d) {
      var i, m, r, res, z, _i, _j, _k, _len, _len1, _ref, _ref1;
      if (d <= 0) {
        alert('0');
      }
      if (this.test_board == null) {
        this.test_board = new KalahBoard(this.cell_count, this.seed_count);
      }
      res = [];
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        if (this.field[side].get_cell(i) > 0) {
          this.fill(this.test_board);
          if (!this.test_board.move(side, i)) {
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
      if (!board.gameOver()) {
        return board.field[side].man - board.field[3 - side].man;
      } else {
        s = board.field[side].man;
        o = board.field[3 - side].man;
        for (i = _i = 0, _ref = board.cell_count - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          s += board.field[side].data[i];
          o += board.field[side].data[i];
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
      if (depth <= 0 || board.gameOver()) {
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
          if (b.gameOver() || depth === 1) {
            curr_rate = this.heur.rate(board, side);
          } else {
            r = this.inf_plus;
            zz = b.possibleMoves(opp);
            _ref = zz.sort(this.heur.sf());
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              mopp = _ref[_j];
              if (r > res_rate) {
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
    function DisplayBoard(board) {
      var fld, i, nCell, r1, rn, rs, sCell, t2, _i, _ref;
      this.alg = new MiniMax(10);
      this.board = board;
      this.tbl = $('<table></table>');
      this.cell_count = board.cell_count;
      r1 = $('<tr></tr>').appendTo(this.tbl);
      this.nMan = $('<td width="60" valign="middle" align="center"></td>').appendTo(r1);
      fld = $('<td></td>').appendTo(r1);
      this.sMan = $('<td width="60" valign="middle" align="center"></td>').appendTo(r1);
      t2 = $('<table></table>').appendTo(fld);
      rn = $('<tr></tr>').appendTo(t2);
      rs = $('<tr></tr>').appendTo(t2);
      this.nFields = [];
      this.sFields = [];
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        nCell = $('<td valign="middle" align="center" width=60 height=60></td>').appendTo(rn);
        this.nFields.push(nCell);
        sCell = $('<td valign="middle" align="center" width=60 height=60></td>').appendTo(rs);
        this.sFields.push(sCell);
        sCell.click(this.clicker(i));
      }
      this.after_move = void 0;
      this.draw();
    }

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

    DisplayBoard.prototype.onCellClick = function(i) {
      var m, mess, mm;
      if (this.board.field[1].get_cell(i) === 0) {
        alert("Пустая ячейка");
        return;
      } else {
        if (!this.board.move(1, i)) {
          mess = this.board.gameOver() ? "Game Over!" : "Ходите дальше!";
          alert(mess);
          this.draw();
          return;
        }
      }
      if (this.board.gameOver()) {
        alert("Game Over!");
        this.draw();
        return;
      }
      m = this.board.possibleMoves(2);
      if (m.length > 0) {
        mm = this.alg.findAnyMove(this.board, 2);
        this.board.do_move(mm, 2);
      }
      if (this.board.gameOver()) {
        alert("Game Over!");
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

    Kalah.prototype.newGame = function() {
      this.board.init();
      return this.display_board.draw();
    };

    Kalah.prototype.init = function() {
      var btnInit, divctrl, f;
      this.display_board = new DisplayBoard(this.board);
      this.display_board.after_move = (function(_this) {
        return function() {
          return _this.span_info.html('Просмотрено позиций ' + _this.display_board.alg.cnt);
        };
      })(this);
      divctrl = $('<div></div>').appendTo($('#root'));
      btnInit = $('<button>Новая игра</button>').appendTo(divctrl);
      $('<p></p>').appendTo(divctrl);
      this.span_info = $('<span></span>').appendTo(divctrl);
      f = $('<font size="7"></font>').appendTo($('#root'));
      this.display_board.tbl.appendTo(f);
      return btnInit.click((function(_this) {
        return function() {
          return _this.newGame();
        };
      })(this));
    };

    return Kalah;

  })();

  a = new Kalah;

  $(document).ready(function() {
    return a.init();
  });

}).call(this);
