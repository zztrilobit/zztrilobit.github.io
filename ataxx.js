(function() {
  var Ataxx, AtaxxBoard, DisplayBoard, a;

  AtaxxBoard = (function() {
    function AtaxxBoard(inipos) {
      var i, j, _i, _j;
      this.field_size = 7;
      this.field = (function() {
        var _i, _j, _ref, _ref1, _results, _results1;
        _results = [];
        for (i = _i = 1, _ref = this.field_size + 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            _results1 = [];
            for (var _j = 1, _ref1 = this.field_size + 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; 1 <= _ref1 ? _j++ : _j--){ _results1.push(_j); }
            return _results1;
          }).apply(this));
        }
        return _results;
      }).call(this);
      for (i = _i = 1; _i <= 7; i = ++_i) {
        for (j = _j = 1; _j <= 7; j = ++_j) {
          this.field[i][j] = 0;
        }
      }
      this.field[1][1] = 1;
      this.field[7][7] = 1;
      this.field[1][7] = 2;
      this.field[7][1] = 2;
    }

    AtaxxBoard.prototype.empty_move = function() {
      return {
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
      var flip, _i, _len, _ref, _results;
      this.field[m.to.y][m.to.x] = side;
      if (m.type === 'j') {
        this.field[m.from.y][m.from.x] = 0;
      }
      _ref = m.flips;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        flip = _ref[_i];
        _results.push(this.field[flip.y][flip.x] = side);
      }
      return _results;
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
      return m.flips = this.list_cnt(to.y, to.x, this.opposite(side));
    };

    AtaxxBoard.prototype.possible_moves = function(side) {
      var di, dj, i, j, ni, nj, res, _i, _j, _k, _l, _len, _len1, _ref, _ref1;
      res = [];
      for (i = _i = 1; _i <= 7; i = ++_i) {
        for (j = _j = 1; _j <= 7; j = ++_j) {
          if (this.field[i][j] === side) {
            _ref = [-2, 2];
            for (_k = 0, _len = _ref.length; _k < _len; _k++) {
              di = _ref[_k];
              _ref1 = [-2, 2];
              for (_l = 0, _len1 = _ref1.length; _l < _len1; _l++) {
                dj = _ref1[_l];
                ni = i + di;
                nj = j + dj;
                if (is_empty(ni, nj) && ((di !== 0) || (dj !== 0))) {
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

  DisplayBoard = (function() {
    function DisplayBoard(board) {
      var cell, i, j, row, _i, _j, _ref, _ref1;
      this.xtag = 'X';
      this.otag = 'O';
      this.board = board;
      this.field_size = board.field_size;
      this.tbl = $('<table></table>');
      this.field = (function() {
        var _i, _j, _ref, _ref1, _results, _results1;
        _results = [];
        for (i = _i = 1, _ref = this.field_size + 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            _results1 = [];
            for (var _j = 1, _ref1 = this.field_size + 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; 1 <= _ref1 ? _j++ : _j--){ _results1.push(_j); }
            return _results1;
          }).apply(this));
        }
        return _results;
      }).call(this);
      this.ready();
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        row = $('<tr></tr>');
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          cell = $('<td valign="middle" align="center" width=40 height=40></td>');
          cell.appendTo(row);
          this.field[i][j] = cell;
          cell.click(this.clicker(i, j));
        }
        this.tbl.append(row);
      }
      this.draw;
    }

    DisplayBoard.prototype.ready = function() {
      this.click_phase = 1;
      this.from = {
        x: 0,
        y: 0
      };
      return this.to = {
        x: 0,
        y: 0
      };
    };

    DisplayBoard.prototype.clicker = function(i, j) {
      return (function(_this) {
        return function(event) {
          return _this.onCellClick(i, j);
        };
      })(this);
    };

    DisplayBoard.prototype.onCellClick = function(i, j) {
      var dx, dy, err, err_msg, m;
      if (click_phase === 1) {
        if (this.board.field[i][j] === 1) {
          this.from.x = j;
          this.from.y = i;
          this.click_phase = 2;
        } else {
          alert('Человек играет крестиками');
        }
      }
      if (click_phase === 2) {
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
          m = this.board.construct_move(from, {
            y: i,
            x: j
          });
          board.do_move(m);
        } else {
          alert(err_msg);
        }
        this.ready();
        return this.draw();
      }
    };

    DisplayBoard.prototype.draw = function() {
      var i, j, _i, _ref, _results;
      _results = [];
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
            switch (this.rb.getState(i, j)) {
              case 0:
                _results1.push(this.field[i][j].html(' '));
                break;
              case 1:
                _results1.push(this.field[i][j].html(this.xtag));
                break;
              case 2:
                _results1.push(this.field[i][j].html(this.otag));
                break;
              case 3:
                _results1.push(this.field[i][j].html('*'));
                break;
              default:
                _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    return DisplayBoard;

  })();

  Ataxx = (function() {
    function Ataxx() {
      this.board = new AtaxxBoard(7);
    }

    Ataxx.prototype.init = function() {
      this.display_board = new DisplayBoard(this.board);
      return this.display_board.tbl.appendTo($('#root'));
    };

    return Ataxx;

  })();

  a = new Ataxx;

  $(document).ready(function() {
    return a.init();
  });

}).call(this);
