(function() {
  var DisplayBoard, Kalah, KalahBoard, KalahSide, MiniMax, NO, YES, a, getRandomA, getRandomInt, getRandomM;

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
        _results.push(b.data[i - 1] = this.data[1]);
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

    KalahBoard.prototype.fill = function(b) {
      this.field[1].fill(b.field[1]);
      return this.field[2].fill(b.field[2]);
    };

    KalahBoard.prototype.init = function() {
      this.field[1].init();
      return this.field[2].init();
    };

    KalahBoard.prototype.move = function(side, cell) {
      var curr_side, done, n, next_point, res, z;
      res = {};
      n = this.field[side].extract_cell(cell);
      next_point = cell + 1;
      curr_side = side;
      while (n-- > 0) {
        done = NO;
        if (next_point === this.cell_count + 1) {
          if (curr_side === side) {
            field[side].man++;
            done = YES;
            res = NO;
          }
          curr_side = 3 - curr_side;
          next_point = 1;
        }
        if (!done && next_point <= this.cell_count) {
          this.field[curr_side].inc_cell(next_point);
          res = YES;
          if (n === 0 && side === curr_side) {
            if (res.cnt > 1) {
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

    KalahBoard.prototype.possible_moves = function(side) {
      var i, m, r, res, z, _i, _j, _k, _len, _len1, _ref, _ref1;
      if (this.test_board === null) {
        this.test_board = new KalahBoard(this.cell_count, this.seed_count);
      }
      res = [];
      for (i = _i = 1, _ref = this.cell_count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        if (this.field[side].get_cell(i) > 0) {
          this.fill(this.test_board);
          if (!this.test_board.move(i)) {
            _ref1 = this.test_board.possible_moves(side);
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

  MiniMax = (function() {
    function MiniMax() {}

    return MiniMax;

  })();

  DisplayBoard = (function() {
    function DisplayBoard(board) {
      var fld, i, nCell, r1, rn, rs, sCell, t2, _i, _ref;
      this.alg = new MiniMax();
      this.board = board;
      this.tbl = $('<table></table>');
      this.cell_count = board.cell_count;
      r1 = $('<tr></tr>').appendTo(this.tbl);
      this.nMan = $('<td></td>').appendTo(r1);
      fld = $('<td></td>').appendTo(r1);
      this.sMan = $('<td></td>').appendTo(r1);
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
      var m, z, _i, _len, _ref, _results;
      if (board.field[1].get_cell(i) === 0) {
        alert("Пустая ячейка");
        return;
      } else {
        if (board.move(1, i)) {
          alert("Ход сделан");
        } else {
          alert("Ходите дальше!");
          return;
        }
      }
      m = this.board.possible_moves(2);
      if (m.length > 0) {
        _ref = getRandomA(m);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          z = _ref[_i];
          _results.push(board.move(2, z));
        }
        return _results;
      }
    };

    return DisplayBoard;

  })();

  Kalah = (function() {
    function Kalah() {
      this.board = new KalahBoard(6, 3);
    }

    Kalah.prototype.newGame = function() {
      this.board.init();
      return this.display_board.draw();
    };

    Kalah.prototype.init = function() {
      var btnInit, divctrl;
      this.display_board = new DisplayBoard(this.board);
      divctrl = $('<div></div>').appendTo($('#root'));
      btnInit = $('<button>Новая игра</button>').appendTo(divctrl);
      $('<p></p>').appendTo(divctrl);
      this.span_info = $('<span></span>').appendTo(divctrl);
      this.display_board.tbl.appendTo($('#root'));
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
