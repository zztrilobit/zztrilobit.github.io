(function() {
  var ConservAlg, ContrAlg, MonteAlg, RandomAlg, Reversi2, ReversiBoard, SimpleAlg, getRandomA, getRandomInt, reversi;

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

    ReversiBoard.prototype.gameOver = function() {
      var pm, res;
      res = 1 === 1;
      pm = this.possibleMoves(1);
      if (pm.length > 0) {
        res = 1 === 0;
      }
      pm = this.possibleMoves(2);
      if (pm.length > 0) {
        return res = 1 === 0;
      }
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

    ReversiBoard.prototype.isCorner = function(j, i) {
      return (j === 1 || j === this.field_size) && (i === 1 || i === this.field_size);
    };

    ReversiBoard.prototype.isPreCorner = function(j, i) {
      var res;
      res = 1 === 2;
      if ((j === 2 || j === this.field_size - 1) && (i === 1 || i === 2 || i === this.field_size || i === this.field_size - 1)) {
        res = 1 === 1;
      }
      if ((i === 2 || i === this.field_size - 1) && (j === 1 || j === 2 || j === this.field_size || j === this.field_size - 1)) {
        res = 1 === 1;
      }
      return res;
    };

    ReversiBoard.prototype.setState = function(i, j, p) {
      return this.field[i][j] = p;
    };

    ReversiBoard.prototype.getState = function(i, j, p) {
      return this.field[i][j];
    };

    ReversiBoard.prototype.opp = function(side) {
      if (side === 1) {
        return 2;
      } else {
        return 1;
      }
    };

    return ReversiBoard;

  })();

  RandomAlg = (function() {
    function RandomAlg() {}

    RandomAlg.prototype.findAnyMove = function(board, side) {
      var pm;
      pm = board.possibleMoves(side);
      return getRandomA(pm);
    };

    return RandomAlg;

  })();

  SimpleAlg = (function() {
    function SimpleAlg() {}

    SimpleAlg.prototype.moveRate = function(m) {
      var res;
      res = m.flips.length;
      if (this.board.isCorner(m.y, m.x)) {
        res = res + 10;
      }
      if (this.board.isPreCorner(m.y, m.x)) {
        res = res - 10;
      }
      return res;
    };

    SimpleAlg.prototype.findAnyMove = function(board, side) {
      var m, maxrate, opp, pm, r, res, tmp, _i, _len;
      this.board = board;
      opp = board.opp(side);
      pm = board.possibleMoves(side);
      maxrate = (-board.maxscore()) * 2;
      tmp = [];
      for (_i = 0, _len = pm.length; _i < _len; _i++) {
        m = pm[_i];
        r = this.moveRate(m);
        if (r = maxrate) {
          tmp.push(m);
        }
        if (r > maxrate) {
          tmp = [];
          tmp.push(m);
          maxrate = r;
          res = m;
          res.rate = r;
        }
      }
      return getRandomA(tmp);
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

    ConservAlg.prototype.moveRate = function(m) {
      var res;
      res = m.flips.length;
      if (this.board.isPreCorner(m.y, m.x)) {
        res = res - 15;
      }
      if (this.board.isCorner(m.y, m.x)) {
        res = res + 10;
      }
      return res;
    };

    ConservAlg.prototype.bestMoves = function(board, side) {
      var b, b2, cost, m, m2, maxopp, maxrate, opp, pm, pm2, r, tmp, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      this.board = board;
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
          r = this.moveRate(m2);
          if (maxopp < r) {
            maxopp = r;
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
        m.rate = this.preAlg.moveRate(m) - a.rate;
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

  MonteAlg = (function() {
    function MonteAlg() {}

    MonteAlg.prototype.bestMoves = function(board, side) {
      var a, algs, b, b2, cost, gameOver, i, m, maxrate, n, opp, pm, rate, rm, rpm, tmp, _i, _j, _k, _l, _len, _len1, _len2;
      opp = side === 1 ? 2 : 1;
      pm = board.possibleMoves(side);
      b = new ReversiBoard(board.field_size);
      b2 = new ReversiBoard(board.field_size);
      cost = 1;
      algs = [];
      algs.push(new SimpleAlg());
      algs.push(new ConservAlg());
      algs.push(new ContrAlg(new ConservAlg()));
      for (_i = 0, _len = pm.length; _i < _len; _i++) {
        m = pm[_i];
        board.fill(b);
        b.apply(m.flips);
        rate = 0;
        for (i = _j = 1; _j <= 500; i = ++_j) {
          gameOver = 1 === 0;
          n = 0;
          while ((!gameOver) && (n < (board.field_size * board.field_size + 10))) {
            gameOver = 1 === 1;
            n++;
            rpm = b.possibleMoves(opp);
            if (rpm.length > 0) {
              gameOver = 1 === 0;
              a = getRandomA(algs);
              rm = getRandomA(rpm);
              b.setState(rm.y, rm.x, opp);
              b.apply(rm.flips);
            }
            rpm = b.possibleMoves(side);
            if (rpm.length > 0) {
              gameOver = 1 === 0;
              rm = getRandomA(rpm);
              b.setState(rm.y, rm.x, side);
              b.apply(rm.flips);
            }
          }
          rate += b.score_side(side);
        }
        m.rate = rate;
        if (board.isCorner(m.x, m.y)) {
          m.rate = rate * 2;
        }
        if (board.isPreCorner(m.x, m.y)) {
          m.rate = rate % 2;
        }
      }
      maxrate = 0;
      for (_k = 0, _len1 = pm.length; _k < _len1; _k++) {
        m = pm[_k];
        if (m.rate > maxrate) {
          maxrate = m.rate;
        }
      }
      tmp = [];
      for (_l = 0, _len2 = pm.length; _l < _len2; _l++) {
        m = pm[_l];
        if (m.rate === maxrate) {
          tmp.push(m);
        }
      }
      return tmp;
    };

    MonteAlg.prototype.findAnyMove = function(board, side) {
      return getRandomA(this.bestMoves(board, side));
    };

    return MonteAlg;

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
      var btn_cons, btn_cons2, btn_greedy, btn_monte, cell, ctrldiv, i, j, row, tbl, _i, _j, _ref, _ref1;
      ctrldiv = $('<div></div>');
      btn_cons = $('<p>Компьютер ирает:</p>').appendTo(ctrldiv);
      btn_greedy = $('<button>Жадно</button>').appendTo(ctrldiv);
      btn_greedy.click((function(_this) {
        return function() {
          return _this.initFieldGreedy();
        };
      })(this));
      btn_cons = $('<button>Осторожно</button>').appendTo(ctrldiv);
      btn_cons.click((function(_this) {
        return function() {
          return _this.initFieldConserv();
        };
      })(this));
      btn_cons2 = $('<button>Оптимистично</button>').appendTo(ctrldiv);
      btn_cons2.click((function(_this) {
        return function() {
          return _this.initFieldConserv2();
        };
      })(this));
      btn_monte = $('<button>Загадочно</button>').appendTo(ctrldiv);
      btn_monte.click((function(_this) {
        return function() {
          return _this.initFieldMonte();
        };
      })(this));
      $('<p></p>').appendTo(ctrldiv);
      $('<span>X:</span>').appendTo(ctrldiv);
      this.spanX = $('<span></span>').appendTo(ctrldiv);
      $('<p></p>').appendTo(ctrldiv);
      $('<span>O:</span>').appendTo(ctrldiv);
      this.spanO = $('<span></span>').appendTo(ctrldiv);
      $('<p></p>').appendTo(ctrldiv);
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
        row = $('<tr></tr>');
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

    Reversi2.prototype.initFieldGreedy = function() {
      this.alg = new SimpleAlg();
      return this.initField();
    };

    Reversi2.prototype.initFieldConserv = function() {
      this.alg = new ConservAlg();
      return this.initField();
    };

    Reversi2.prototype.initFieldConserv2 = function() {
      this.calg = new ConservAlg();
      this.alg = new MonteAlg(this.calg);
      return this.initField();
    };

    Reversi2.prototype.initFieldMonte = function() {
      this.alg = new MonteAlg();
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
