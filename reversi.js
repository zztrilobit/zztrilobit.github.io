(function() {
  var ConservAlg, ContrAlg, Reversi2, ReversiBoard, SimpleAlg, getRandomA, getRandomInt, reversi;

  ReversiBoard = (function() {
    function ReversiBoard(fs) {
      var i;
      this.field_size = fs;
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
      this.init();
    }

    ReversiBoard.prototype.maxscore = function() {
      return this.field_size * this.field_size + 20;
    };

    ReversiBoard.prototype.init = function() {
      var i, j, n, _i, _j, _ref, _ref1;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          this.field[i][j] = 0;
        }
      }
      n = this.field_size / 2;
      this.field[n][n] = 1;
      this.field[n + 1][n + 1] = 1;
      this.field[n][n + 1] = 2;
      return this.field[n + 1][n] = 2;
    };

    ReversiBoard.prototype.clone = function() {
      var res;
      res = new ReversiBoard(this.field_size);
      this.fill(res);
      return res;
    };

    ReversiBoard.prototype.fill = function(dest) {
      var i, j, _i, _ref, _results;
      _results = [];
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
            _results1.push(dest.field[i][j] = this.field[i][j]);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    ReversiBoard.prototype.roll = function(y, x) {
      var n;
      switch (this.field[y][x]) {
        case 1:
          n = 2;
          break;
        case 2:
          n = 1;
          break;
        default:
          0;
      }
      return this.field[y][x] = n;
    };

    ReversiBoard.prototype.getFlips = function(y, x, p) {
      var a2, dir, dirs, dx, dy, flip, flips, i, j, nx, ny, t, temp, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
      if (this.field[y][x] !== 0) {
        return [];
      }
      dirs = [];
      a2 = function(x, y) {
        return [x, y];
      };
      flips = [];
      _ref = [-1, 0, 1];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _ref1 = [-1, 0, 1];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          j = _ref1[_j];
          if ((i !== 0) || (j !== 0)) {
            dirs.push(a2(i, j));
          }
        }
      }
      for (_k = 0, _len2 = dirs.length; _k < _len2; _k++) {
        dir = dirs[_k];
        dy = dir[0];
        dx = dir[1];
        nx = x + dx;
        ny = y + dy;
        temp = [];
        while ((nx >= 1) && (nx <= this.field_size) && (ny >= 1) && (ny <= this.field_size) && (this.field[ny][nx] !== 0) && (this.field[ny][nx] !== p)) {
          temp.push({
            y: ny,
            x: nx
          });
          nx = nx + dx;
          ny = ny + dy;
        }
        if ((nx >= 1) && (nx <= this.field_size) && (ny >= 1) && (ny <= this.field_size) && (this.field[ny][nx] === p)) {
          for (_l = 0, _len3 = temp.length; _l < _len3; _l++) {
            t = temp[_l];
            flip = {
              y: t.y,
              x: t.x
            };
            flips.push(flip);
          }
        }
      }
      return flips;
    };

    ReversiBoard.prototype.apply = function(flips) {
      var flip, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = flips.length; _i < _len; _i++) {
        flip = flips[_i];
        _results.push(this.roll(flip.y, flip.x));
      }
      return _results;
    };

    ReversiBoard.prototype.score = function() {
      var i, j, scoreO, scoreX, _i, _j, _ref, _ref1;
      scoreX = 0;
      scoreO = 0;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          if (this.field[i][j] === 1) {
            scoreX++;
          }
          if (this.field[i][j] === 2) {
            scoreO++;
          }
        }
      }
      return {
        sx: scoreX,
        so: scoreO
      };
    };

    ReversiBoard.prototype.score_side = function(s) {
      var i, j, score, _i, _j, _ref, _ref1;
      score = 0;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          if (this.field[i][j] === s) {
            score++;
          }
        }
      }
      return score;
    };

    ReversiBoard.prototype.delta_side = function(s) {
      var opp;
      if (s === 1) {
        opp = 2;
      } else {
        opp = 1;
      }
      return this.score_side(s) - this.score_side(opp);
    };

    ReversiBoard.prototype.possibleMoves = function(side) {
      var found_x, found_y, foundflips, i, j, moves, tmpflips, _i, _j, _ref, _ref1;
      tmpflips = [];
      foundflips = [];
      found_y = 0;
      found_x = 0;
      moves = [];
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          tmpflips = this.getFlips(i, j, side);
          if (tmpflips.length > 0) {
            foundflips = [];
            found_y = i;
            found_x = j;
            moves.push({
              y: found_y,
              x: found_x,
              flips: tmpflips
            });
          }
        }
      }
      return moves;
    };

    ReversiBoard.prototype.setState = function(i, j, p) {
      return this.field[i][j] = p;
    };

    ReversiBoard.prototype.getState = function(i, j, p) {
      return this.field[i][j];
    };

    return ReversiBoard;

  })();

  SimpleAlg = (function() {
    function SimpleAlg() {}

    SimpleAlg.prototype.findAnyMove = function(board, side) {
      var found_x, found_y, foundflips, m, opp, pm, result, t, tmpflips, _i, _j, _len, _len1, _ref;
      opp = side === 1 ? 2 : 1;
      tmpflips = [];
      foundflips = [];
      found_y = 0;
      found_x = 0;
      pm = board.possibleMoves(side);
      for (_i = 0, _len = pm.length; _i < _len; _i++) {
        m = pm[_i];
        if (m.flips.length > foundflips.length) {
          foundflips = [];
          found_y = m.y;
          found_x = m.x;
          _ref = m.flips;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            t = _ref[_j];
            foundflips.push(t);
          }
        }
      }
      result = {
        x: found_x,
        y: found_y,
        flips: foundflips
      };
      return result;
    };

    return SimpleAlg;

  })();

  getRandomInt = function(mn, mx) {
    return Math.floor(Math.random() * (mx - mn + 1)) + mn;
  };

  getRandomA = function(a) {
    return a[getRandomInt(0, a.length - 1)];
  };

  ConservAlg = (function() {
    function ConservAlg() {}

    ConservAlg.prototype.bestMoves = function(board, side) {
      var b, b2, cost, m, m2, maxopp, maxrate, opp, pm, pm2, tmp, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      opp = side === 1 ? 2 : 1;
      pm = board.possibleMoves(side);
      b = new ReversiBoard(board.field_size);
      b2 = new ReversiBoard(board.field_size);
      cost = 1;
      for (_i = 0, _len = pm.length; _i < _len; _i++) {
        m = pm[_i];
        board.fill(b);
        b.apply(m.flips);
        pm2 = b.possibleMoves(opp);
        maxopp = 0;
        for (_j = 0, _len1 = pm2.length; _j < _len1; _j++) {
          m2 = pm2[_j];
          if (maxopp < m2.flips.length) {
            maxopp = m2.flips.length;
          }
        }
        m.rate = m.flips.length - maxopp;
      }
      maxrate = -board.maxscore();
      for (_k = 0, _len2 = pm.length; _k < _len2; _k++) {
        m = pm[_k];
        if (m.rate > maxrate) {
          maxrate = m.rate;
        }
      }
      tmp = [];
      for (_l = 0, _len3 = pm.length; _l < _len3; _l++) {
        m = pm[_l];
        if (m.rate === maxrate) {
          tmp.push(m);
        }
      }
      return tmp;
    };

    ConservAlg.prototype.findAnyMove = function(board, side) {
      return getRandomA(this.bestMoves(board, side));
    };

    return ConservAlg;

  })();

  ContrAlg = (function() {
    function ContrAlg(pa) {
      this.preAlg = pa;
    }

    ContrAlg.prototype.bestMoves = function(board, side) {
      var a, b, cost, m, maxrate, opp, pm, tmp, _i, _j, _k, _len, _len1, _len2;
      opp = side === 1 ? 2 : 1;
      pm = board.possibleMoves(side);
      b = new ReversiBoard(board.field_size);
      cost = 1;
      for (_i = 0, _len = pm.length; _i < _len; _i++) {
        m = pm[_i];
        board.fill(b);
        b.apply(m.flips);
        a = this.preAlg.findAnyMove(board, opp);
        m.rate = m.flips.length - a.rate;
      }
      maxrate = -board.maxscore();
      for (_j = 0, _len1 = pm.length; _j < _len1; _j++) {
        m = pm[_j];
        if (m.rate > maxrate) {
          maxrate = m.rate;
        }
      }
      tmp = [];
      for (_k = 0, _len2 = pm.length; _k < _len2; _k++) {
        m = pm[_k];
        if (m.rate === maxrate) {
          tmp.push(m);
        }
      }
      return tmp;
    };

    ContrAlg.prototype.findAnyMove = function(board, side) {
      return getRandomA(this.bestMoves(board, side));
    };

    return ContrAlg;

  })();

  Reversi2 = (function() {
    function Reversi2() {
      this.calg = new ConservAlg();
      this.alg = new ContrAlg(this.calg);
    }

    Reversi2.prototype.clicker = function(i, j) {
      return (function(_this) {
        return function(event) {
          return _this.onCellClick(i, j);
        };
      })(this);
    };

    Reversi2.prototype.onCellClick = function(i, j) {
      var done, flips, myMove, r;
      flips = this.rb.getFlips(i, j, 1);
      if (flips.length > 0) {
        this.rb.setState(i, j, 1);
        this.rb.apply(flips);
      } else {
        r = this.rb.possibleMoves(1);
        if (r.length > 0) {
          alert("Ход неверен, есть возможность правильного хода");
          return;
        }
      }
      myMove = 1 === 1;
      done = 1 === 0;
      this.draw();
      r = this.findAnyMove(2);
      while (myMove && (!done)) {
        if (r.flips.length > 0) {
          this.rb.setState(r.y, r.x, 2);
          this.rb.apply(r.flips);
        }
        r = this.findAnyMove(1);
        if (r.flips.length > 0) {
          myMove = 1 === 0;
        } else {
          r = this.findAnyMove(2);
          done = r.flips.length === 0;
        }
      }
      this.draw();
      if (done) {
        alert("Game over!");
      }
    };

    Reversi2.prototype.findAnyMove = function(side) {
      return this.alg.findAnyMove(this.rb, side);
    };

    Reversi2.prototype.calc = function() {
      var s;
      s = this.rb.score();
      this.spanX.html(s.sx);
      return this.spanO.html(s.so);
    };

    Reversi2.prototype.draw = function() {
      var i, j, _i, _ref, _results;
      this.calc();
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
                _results1.push(this.field[i][j].html('<b>X</b>'));
                break;
              case 2:
                _results1.push(this.field[i][j].html('<b>O</b>'));
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

    Reversi2.prototype.init = function() {
      var btn_init, cell, ctrldiv, i, j, row, tbl, _i, _j, _ref, _ref1;
      ctrldiv = $('<div></div>');
      btn_init = $('<button>Init</button>').appendTo(ctrldiv);
      $('<p></p>').appendTo(ctrldiv);
      $('<span>X:</span>').appendTo(ctrldiv);
      this.spanX = $('<span></span>').appendTo(ctrldiv);
      $('<p></p>').appendTo(ctrldiv);
      $('<span>O:</span>').appendTo(ctrldiv);
      this.spanO = $('<span></span>').appendTo(ctrldiv);
      $('<p></p>').appendTo(ctrldiv);
      btn_init.click((function(_this) {
        return function() {
          return _this.initField();
        };
      })(this));
      ctrldiv.appendTo($("#root"));
      tbl = $('<table></table>');
      tbl.appendTo($("#root"));
      this.field_size = 8;
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
      this.rb = new ReversiBoard(this.field_size);
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        row = $('<row></row>');
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          cell = $('<td valign="middle" align="center" width=40 height=40></td>');
          cell.appendTo(row);
          this.field[i][j] = cell;
          cell.click(this.clicker(i, j));
        }
        tbl.append(row);
      }
      return this.initField();
    };

    Reversi2.prototype.initField = function() {
      this.rb.init();
      return this.draw();
    };

    return Reversi2;

  })();

  reversi = new Reversi2;

  window.g_reversi = reversi;

  $(document).ready(function() {
    return reversi.init();
  });

}).call(this);
