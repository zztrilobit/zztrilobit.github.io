(function() {
  var Ataxx, AtaxxBoard, DisplayBoard, MiniMax, a, getRandomA, getRandomInt;

  getRandomInt = function(mn, mx) {
    return Math.floor(Math.random() * (mx - mn + 1)) + mn;
  };

  getRandomA = function(a) {
    return a[getRandomInt(0, a.length - 1)];
  };

  AtaxxBoard = (function() {
    AtaxxBoard.prototype.strt_pos = function() {
      this.spp = [];
      this.spp.push([[3, 0], [3, 1], [3, 2], [0, 3], [1, 3], [2, 3], [4, 3], [5, 3], [6, 3], [3, 4], [3, 5], [3, 6]]);
      this.spp.push([[3, 0], [1, 2], [2, 2], [4, 2], [5, 2], [0, 3], [1, 3], [5, 3], [6, 3], [1, 4], [2, 4], [4, 4], [5, 4], [3, 6]]);
      this.spp.push([[1, 0], [5, 0], [0, 1], [6, 1], [3, 3], [0, 5], [6, 5], [1, 6], [5, 6]]);
      this.spp.push([[2, 0], [4, 0], [2, 1], [4, 1], [0, 3], [6, 3], [2, 5], [4, 5], [2, 6], [4, 6]]);
      this.spp.push([[3, 0], [3, 1], [0, 3], [1, 3], [5, 3], [6, 3], [3, 5], [3, 6]]);
      this.spp.push([[3, 1], [2, 2], [4, 2], [1, 3], [5, 3], [2, 4], [4, 4], [3, 5]]);
      this.spp.push([[2, 0], [4, 0], [0, 2], [6, 2], [0, 4], [6, 4], [2, 6], [4, 6]]);
      this.spp.push([[3, 0], [2, 1], [4, 1], [1, 2], [5, 2], [0, 3], [6, 3], [1, 4], [5, 4], [2, 5], [4, 5], [3, 6]]);
      this.spp.push([[2, 1], [4, 1], [1, 2], [5, 2], [1, 4], [5, 4], [2, 5], [4, 5]]);
      this.spp.push([[2, 0], [4, 0], [2, 2], [4, 2], [1, 3], [5, 3], [2, 4], [4, 4], [2, 6], [4, 6]]);
      this.spp.push([[3, 1], [3, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [3, 4], [3, 5]]);
      this.spp.push([[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [1, 2], [5, 2], [1, 3], [5, 3], [1, 4], [5, 4], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]]);
      this.spp.push([[2, 1], [3, 1], [4, 1], [1, 2], [5, 2], [1, 3], [5, 3], [1, 4], [5, 4], [2, 5], [3, 5], [4, 5]]);
      this.spp.push([[2, 1], [4, 1], [1, 2], [2, 2], [4, 2], [5, 2], [1, 4], [2, 4], [4, 4], [5, 4], [2, 5], [4, 5]]);
      this.spp.push([[1, 1], [5, 5], [1, 5], [5, 1]]);
      this.spp.push([[1, 1], [2, 1], [4, 1], [5, 1], [1, 2], [5, 2], [1, 4], [5, 4], [1, 5], [2, 5], [4, 5], [5, 5]]);
      this.spp.push([[3, 2], [2, 3], [3, 3], [4, 3], [3, 4]]);
      this.spp.push([[3, 2], [2, 3], [4, 3], [3, 4]]);
      this.spp.push([[3, 1], [3, 2], [1, 3], [2, 3], [4, 3], [5, 3], [3, 4], [3, 5]]);
      this.spp.push([[2, 0], [3, 0], [4, 0], [3, 1], [0, 2], [6, 2], [0, 3], [1, 3], [5, 3], [6, 3], [0, 4], [6, 4], [3, 5], [2, 6], [3, 6], [4, 6]]);
      this.spp.push([[2, 0], [4, 0], [3, 1], [0, 2], [6, 2], [1, 3], [5, 3], [0, 4], [6, 4], [3, 5], [2, 6], [4, 6]]);
      this.spp.push([[2, 0], [4, 0], [3, 1], [0, 2], [6, 2], [1, 3], [5, 3], [0, 4], [6, 4], [3, 5], [2, 6], [4, 6]]);
      this.spp.push([[1, 1], [3, 1], [5, 1], [1, 3], [3, 3], [5, 3], [1, 5], [3, 5], [5, 5]]);
      this.spp.push([[2, 2], [4, 2], [3, 3], [2, 4], [4, 4]]);
      this.spp.push([[1, 1], [5, 1], [2, 2], [4, 2], [3, 3], [2, 4], [4, 4], [1, 5], [5, 5]]);
      this.spp.push([[2, 0], [3, 0], [4, 0], [2, 1], [4, 1], [0, 3], [6, 3], [2, 5], [4, 5], [2, 6], [3, 6], [4, 6]]);
      this.spp.push([[1, 0], [3, 0], [5, 0], [0, 1], [2, 1], [4, 1], [6, 1], [1, 2], [3, 2], [5, 2], [0, 3], [2, 3], [4, 3], [6, 3], [1, 4], [3, 4], [5, 4], [0, 5], [2, 5], [4, 5], [6, 5], [1, 6], [3, 6], [5, 6]]);
      this.spp.push([[1, 1], [5, 1], [2, 2], [4, 2], [2, 4], [4, 4], [1, 5], [5, 5]]);
      this.spp.push([[3, 0], [2, 1], [4, 1], [0, 3], [6, 3], [2, 5], [4, 5], [3, 6]]);
      this.spp.push([[3, 0], [0, 3], [6, 3], [3, 6]]);
      this.spp.push([[3, 1], [1, 3], [5, 3], [3, 5]]);
      this.spp.push([[2, 0], [3, 0], [4, 0], [0, 2], [1, 2], [3, 2], [5, 2], [6, 2], [0, 3], [6, 3], [0, 4], [1, 4], [3, 4], [5, 4], [6, 4], [2, 6], [3, 6], [4, 6]]);
      this.spp.push([[2, 1], [4, 1], [0, 2], [1, 2], [3, 2], [5, 2], [6, 2], [3, 3], [0, 4], [1, 4], [3, 4], [5, 4], [6, 4], [2, 5], [4, 5]]);
      return this.spp.push([[2, 0], [4, 0], [2, 1], [4, 1], [0, 2], [6, 2], [0, 3], [3, 3], [6, 3], [0, 4], [6, 4], [2, 5], [4, 5], [2, 6], [4, 6]]);
    };

    AtaxxBoard.prototype.init = function() {
      var i, j, p, pp, _i, _j, _k, _len, _results;
      for (i = _i = 1; _i <= 7; i = ++_i) {
        for (j = _j = 1; _j <= 7; j = ++_j) {
          this.field[i][j] = 0;
        }
      }
      this.field[1][1] = 1;
      this.field[7][7] = 1;
      this.field[1][7] = 2;
      this.field[7][1] = 2;
      pp = getRandomA(this.spp);
      _results = [];
      for (_k = 0, _len = pp.length; _k < _len; _k++) {
        p = pp[_k];
        _results.push(this.field[p[0] + 1][p[1] + 1] = 3);
      }
      return _results;
    };

    function AtaxxBoard() {
      var i, j, _i, _j;
      this.strt_pos();
      this.field_size = 7;
      this.field = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i <= 7; i = ++_i) {
          _results.push([0, 1, 2, 3, 4, 5, 6, 7]);
        }
        return _results;
      })();
      this.dirs = [];
      for (i = _i = -1; _i <= 1; i = ++_i) {
        for (j = _j = -1; _j <= 1; j = ++_j) {
          if (i !== 0 && j !== 0) {
            this.dirs.push({
              dx: i,
              dy: j
            });
          }
        }
      }
      this.init();
    }

    AtaxxBoard.prototype.copy_to = function(b) {
      var i, j, _i, _results;
      _results = [];
      for (i = _i = 1; _i <= 7; i = ++_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (j = _j = 1; _j <= 7; j = ++_j) {
            _results1.push(b.field[i][j] = this.field[i][j]);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    AtaxxBoard.prototype.getState = function(i, j) {
      return this.field[i][j];
    };

    AtaxxBoard.prototype.empty_move = function() {
      var res;
      res = {
        side: 0,
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 0,
          y: 0
        },
        type: '',
        flips: []
      };
      return res;
    };

    AtaxxBoard.prototype.in_field = function(i, j) {
      return (i > 0) && (i <= this.field_size) && (j > 0) && (j <= this.field_size);
    };

    AtaxxBoard.prototype.is_empty = function(i, j) {
      if (this.in_field(i, j)) {
        return this.field[i][j] === 0;
      } else {
        return 1 === 0;
      }
    };

    AtaxxBoard.prototype.opposite = function(side) {
      if (side === 1) {
        return 2;
      } else {
        return 1;
      }
    };

    AtaxxBoard.prototype.list_cnt = function(y, x, side) {
      var di, dj, res, _i, _j;
      res = [];
      for (di = _i = -1; _i <= 1; di = ++_i) {
        for (dj = _j = -1; _j <= 1; dj = ++_j) {
          if (this.in_field(y + di, x + dj) && ((di !== 0) || (dj !== 0))) {
            if (this.field[y + di][x + dj] === side) {
              res.push({
                x: x + dj,
                y: y + di
              });
            }
          }
        }
      }
      return res;
    };

    AtaxxBoard.prototype.do_move = function(side, m) {
      var flip, _i, _len, _ref;
      this.field[m.to.y][m.to.x] = side;
      if (m.type === 'j') {
        this.field[m.from.y][m.from.x] = 0;
      }
      _ref = m.flips;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        flip = _ref[_i];
        this.field[flip.y][flip.x] = side;
      }
    };

    AtaxxBoard.prototype.construct_move = function(from, to, side) {
      var dx, dy, m;
      dx = to.x - from.x;
      dy = to.y - from.y;
      m = this.empty_move();
      m.side = side;
      m.from.x = from.x;
      m.from.y = from.y;
      m.to.x = to.x;
      m.to.y = to.y;
      if ((dx === 2) || (dy === 2) || (dx === -2) || (dy === -2)) {
        m.type = 'j';
      } else {
        m.type = 's';
      }
      m.flips = this.list_cnt(to.y, to.x, this.opposite(side));
      return m;
    };

    AtaxxBoard.prototype.count = function(side) {
      var i, j, res, _i, _j, _ref, _ref1;
      res = 0;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          if (this.field[i][j] === side) {
            res += 1;
          }
        }
      }
      return res;
    };

    AtaxxBoard.prototype.game_over = function() {
      if (this.possible_moves(1).length > 0) {
        return 1 === 0;
      }
      if (this.possible_moves(2).length > 0) {
        return 1 === 0;
      }
      return 1 === 1;
    };

    AtaxxBoard.prototype.possible_moves = function(side) {
      var di, dj, i, j, ni, nj, res, _i, _j, _k, _l;
      res = [];
      for (i = _i = 1; _i <= 7; i = ++_i) {
        for (j = _j = 1; _j <= 7; j = ++_j) {
          if (this.field[i][j] === side) {
            for (di = _k = -2; _k <= 2; di = ++_k) {
              for (dj = _l = -2; _l <= 2; dj = ++_l) {
                ni = i + di;
                nj = j + dj;
                if (this.is_empty(ni, nj) && ((di !== 0) || (dj !== 0))) {
                  res.push(this.construct_move({
                    y: i,
                    x: j
                  }, {
                    y: ni,
                    x: nj
                  }));
                }
              }
            }
          }
        }
      }
      return res;
    };

    return AtaxxBoard;

  })();

  MiniMax = (function() {
    function MiniMax() {
      this.inf_plus = 10000;
      this.inf_minus = -10000;
      this.cnt = 0;
    }

    MiniMax.prototype.opp = function(side) {
      return 3 - side;
    };

    MiniMax.prototype.rate = function(board, side) {
      var c, co;
      this.cnt++;
      c = board.count(side);
      if (c === 0) {
        return this.inf_minus;
      }
      co = board.count(3 - side);
      if (co === 0) {
        return this.inf_plus;
      }
      return c - co;
    };

    MiniMax.prototype.alfa_beta = function(side, board, level, round) {
      var b, contra, done, m, my_best_rate, opposite, pm, r, t, _i, _j, _k, _len, _len1, _len2;
      if (level === 0 || board.game_over()) {
        return {
          rate: this.rate(board, side)
        };
      }
      pm = board.possible_moves(side);
      b = new AtaxxBoard();
      opposite = 3 - side;
      my_best_rate = this.inf_minus;
      done = 1 === 0;
      for (_i = 0, _len = pm.length; _i < _len; _i++) {
        m = pm[_i];
        m.rate = this.inf_minus;
      }
      for (_j = 0, _len1 = pm.length; _j < _len1; _j++) {
        m = pm[_j];
        if (!done) {
          board.copy_to(b);
          b.do_move(side, m);
          contra = this.alfa_beta(opposite, b, level - 1, -my_best_rate);
          r = -contra.rate;
          m.rate = r;
          if (r >= my_best_rate) {
            my_best_rate = r;
          }
          if (my_best_rate > round) {
            done = 1 === 1;
          }
        }
      }
      t = [];
      for (_k = 0, _len2 = pm.length; _k < _len2; _k++) {
        m = pm[_k];
        if (m.rate === my_best_rate) {
          t.push(m);
        }
      }
      return {
        rate: my_best_rate,
        move: getRandomA(t)
      };
    };

    MiniMax.prototype.find_move = function(side, board, depth) {
      this.cnt = 0;
      return this.alfa_beta(side, board, depth, this.inf_plus).move;
    };

    return MiniMax;

  })();

  DisplayBoard = (function() {
    function DisplayBoard(board) {
      var cell, i, j, rnm, row, _i, _j, _k, _l, _m, _ref, _ref1, _ref2;
      this.alg = new MiniMax();
      this.xtag = '<b>X</b>';
      this.otag = '<b>O</b>';
      this.board = board;
      this.field_size = board.field_size;
      this.tbl = $('<table></table>');
      this.field = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i <= 7; i = ++_i) {
          _results.push([0, 1, 2, 3, 4, 5, 6, 7]);
        }
        return _results;
      })();
      this.var_x = [];
      this.after_move = 0;
      this.dirs = [];
      for (i = _i = -1; _i <= 1; i = ++_i) {
        for (j = _j = -1; _j <= 1; j = ++_j) {
          if ((i !== 0) || (j !== 0)) {
            this.dirs.push({
              dx: i,
              dy: j
            });
          }
        }
      }
      this.ready();
      rnm = ['', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
      for (i = _k = 1, _ref = this.field_size; 1 <= _ref ? _k <= _ref : _k >= _ref; i = 1 <= _ref ? ++_k : --_k) {
        row = $('<tr></tr>');
        $('<td valign="middle" align="center" width=40 height=40>' + rnm[i] + '</td>').appendTo(row);
        for (j = _l = 1, _ref1 = this.field_size; 1 <= _ref1 ? _l <= _ref1 : _l >= _ref1; j = 1 <= _ref1 ? ++_l : --_l) {
          cell = $('<td valign="middle" align="center" width=40 height=40></td>');
          cell.appendTo(row);
          this.field[i][j] = cell;
          cell.click(this.clicker(i, j));
        }
        this.tbl.append(row);
      }
      row = $('<tr></tr>');
      $('<td valign="middle" align="center" width=40 height=40>' + '</td>').appendTo(row);
      for (j = _m = 1, _ref2 = this.field_size; 1 <= _ref2 ? _m <= _ref2 : _m >= _ref2; j = 1 <= _ref2 ? ++_m : --_m) {
        $('<td valign="middle" align="center" width=40 height=40>' + j + '</td>').appendTo(row);
      }
      this.tbl.append(row);
      this.draw();
    }

    DisplayBoard.prototype.ready = function() {
      this.click_phase = 1;
      this.from = {
        x: 0,
        y: 0
      };
      this.to = {
        x: 0,
        y: 0
      };
      return this.var_x = [];
    };

    DisplayBoard.prototype.clicker = function(i, j) {
      return (function(_this) {
        return function() {
          return _this.onCellClick(i, j);
        };
      })(this);
    };

    DisplayBoard.prototype.onCellClick = function(i, j) {
      var dx, dy, err, err_msg, m, nx, ny, pm, _i, _j;
      if (this.click_phase === 1) {
        if (this.board.field[i][j] === 1) {
          this.from.x = j;
          this.from.y = i;
          this.click_phase = 2;
          this.var_x = [];
          for (dx = _i = -2; _i <= 2; dx = ++_i) {
            for (dy = _j = -2; _j <= 2; dy = ++_j) {
              if (dx !== 0 || dy !== 0) {
                nx = j + dx;
                ny = i + dy;
                if (nx >= 1 && ny >= 1 && nx <= this.board.field_size && ny <= this.board.field_size) {
                  if (this.board.field[ny][nx] === 0) {
                    this.var_x.push({
                      x: nx,
                      y: ny
                    });
                  }
                }
              }
            }
          }
          this.draw();
        } else {
          alert('Человек играет крестиками');
        }
        return;
      }
      if (this.click_phase === 2) {
        dx = j - this.from.x;
        dy = i - this.from.y;
        err = 1 === 0;
        if ((dx > 2) || (dx < -2) || (dy > 2) || (dy < -2)) {
          err = 1 === 1;
          err_msg = "Окончание хода слишком далеко от начала";
        }
        if (!this.board.is_empty(i, j)) {
          err = 1 === 1;
          err_msg = "Поле занято";
        }
        if (!err) {
          m = this.board.construct_move(this.from, {
            y: i,
            x: j
          }, 1);
          this.board.do_move(1, m);
          if (!this.board.game_over()) {
            pm = this.board.possible_moves(2);
            if (pm.length > 0) {
              m = this.alg.find_move(2, this.board, 5);
              this.board.do_move(2, m);
            }
          }
        } else {
          alert(err_msg);
        }
        this.ready();
      }
      this.draw();
      if (this.after_move !== 0) {
        return this.after_move();
      }
    };

    DisplayBoard.prototype.draw = function() {
      var i, j, s, v, _i, _j, _k, _len, _ref, _ref1, _ref2, _results;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          s = this.board.getState(i, j);
          if (s === 0) {
            this.field[i][j].html(' ');
          }
          if (s === 1) {
            this.field[i][j].html(this.xtag);
          }
          if (s === 2) {
            this.field[i][j].html(this.otag);
          }
          if (s === 3) {
            this.field[i][j].html('#');
          }
        }
      }
      if (this.click_phase === 2) {
        _ref2 = this.var_x;
        _results = [];
        for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
          v = _ref2[_k];
          _results.push(this.field[v.y][v.x].html('?'));
        }
        return _results;
      }
    };

    return DisplayBoard;

  })();

  Ataxx = (function() {
    function Ataxx() {
      this.board = new AtaxxBoard(7);
    }

    Ataxx.prototype.newGame = function() {
      this.board.init();
      return this.display_board.draw();
    };

    Ataxx.prototype.afterMove = function() {
      var go;
      this.span_info.html('Просмотрено позиций ' + this.display_board.alg.cnt);
      go = '';
      if (this.board.game_over()) {
        if (this.board.count(1) === this.board.count(2)) {
          go = 'Ничья!';
        }
        if (this.board.count(1) > this.board.count(2)) {
          go = 'Победа X';
        }
        if (this.board.count(1) < this.board.count(2)) {
          go = 'Победа O';
        }
      }
      return this.game_info.html('Счет: X-' + this.board.count(1) + ' O-' + this.board.count(2) + ' ' + go);
    };

    Ataxx.prototype.init = function() {
      var btnInit, divctrl;
      this.display_board = new DisplayBoard(this.board);
      this.display_board.after_move = (function(_this) {
        return function() {
          return _this.afterMove();
        };
      })(this);
      divctrl = $('<div></div>').appendTo($('#root'));
      btnInit = $('<button>Новая игра</button>').appendTo(divctrl);
      $('<p></p>').appendTo(divctrl);
      this.game_info = $('<span></span>').appendTo(divctrl);
      $('<p></p>').appendTo(divctrl);
      this.span_info = $('<span></span>').appendTo(divctrl);
      this.display_board.tbl.appendTo($('#root'));
      return btnInit.click((function(_this) {
        return function() {
          return _this.newGame();
        };
      })(this));
    };

    return Ataxx;

  })();

  a = new Ataxx;

  $(document).ready(function() {
    return a.init();
  });

}).call(this);
