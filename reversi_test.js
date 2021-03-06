﻿(function() {
  var ConservAlg, ContrAlg, Heuristic, MinMaxAlg, MinMaxExAlg, MiniMaxABAlg, MonteAlg, RandomAlg, Reversi2, ReversiBoard, SimpleAlg, getRandomA, getRandomInt, getRandomM, reversi;

  ReversiBoard = (function() {
    function ReversiBoard(fs) {
      var done, i, j, rmap, row, _i, _j, _k, _l, _len, _len1, _m, _n, _o, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      this.counts = [0, 1, 2];
      this.field_size = fs;
      this.field = [];
      this.map = [];
      for (i = _i = 1, _ref = this.field_size + 1; _i <= _ref; i = _i += 1) {
        row = [];
        rmap = [];
        for (j = _j = 1, _ref1 = this.field_size + 1; _j <= _ref1; j = _j += 1) {
          row.push(0);
        }
        for (j = _k = 1, _ref2 = this.field_size + 1; _k <= _ref2; j = _k += 1) {
          rmap.push({
            dummy: ""
          });
        }
        this.field.push(row);
        this.map.push(rmap);
      }
      for (i = _l = 1, _ref3 = this.field_size; _l <= _ref3; i = _l += 1) {
        for (j = _m = 1, _ref4 = this.field_size; _m <= _ref4; j = _m += 1) {
          done = 1 === 0;
          this.map[i][j].cy = i < (this.field_size / 2 + 1) ? 1 : this.field_size;
          this.map[i][j].cx = j < (this.field_size / 2 + 1) ? 1 : this.field_size;
          if (this.isCorner(i, j)) {
            this.map[i][j].type = 'CORNER';
            done = 1 === 1;
          }
          if (!done && this.isPreCorner(i, j)) {
            this.map[i][j].type = 'PRE_CORNER';
            done = 1 === 1;
          }
          if (!done && (i === 1 || i === this.field_size || j === 1 || j === this.field_size)) {
            this.map[i][j].type = '1_LINE';
            done = 1 === 1;
          }
          if (!done && (i === 2 || i === this.field_size - 1 || j === 2 || j === this.field_size - 1)) {
            this.map[i][j].type = '2_LINE';
            done = 1 === 1;
          }
          if (!done) {
            this.map[i][j].type = 'CENTER';
            done = 1 === 1;
          }
        }
      }
      this.dirs = [];
      _ref5 = [-1, 0, 1];
      for (_n = 0, _len = _ref5.length; _n < _len; _n++) {
        i = _ref5[_n];
        _ref6 = [-1, 0, 1];
        for (_o = 0, _len1 = _ref6.length; _o < _len1; _o++) {
          j = _ref6[_o];
          if ((i !== 0) || (j !== 0)) {
            this.dirs.push([i, j]);
          }
        }
      }
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
      this.field[n + 1][n] = 2;
      this.counts[1] = 2;
      return this.counts[2] = 2;
    };

    ReversiBoard.prototype.clone = function() {
      var res;
      res = new ReversiBoard(this.field_size);
      this.fill(res);
      return res;
    };

    ReversiBoard.prototype.fill = function(dest) {
      var i, j, _i, _j, _ref, _ref1;
      dest.counts[1] = this.counts[1];
      dest.counts[2] = this.counts[2];
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          dest.field[i][j] = this.field[i][j];
        }
      }
      return this;
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
      var a2, dir, dx, dy, flip, flips, nx, ny, opp, t, temp, _i, _j, _len, _len1, _ref;
      if (this.field[y][x] !== 0) {
        return [];
      }
      opp = p === 1 ? 2 : 1;
      a2 = function(x, y) {
        return [x, y];
      };
      flips = [];
      _ref = this.dirs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dir = _ref[_i];
        dy = dir[0];
        dx = dir[1];
        nx = x + dx;
        ny = y + dy;
        temp = [];
        while ((nx >= 1) && (nx <= this.field_size) && (ny >= 1) && (ny <= this.field_size) && (this.field[ny][nx] === opp)) {
          temp.push({
            y: ny,
            x: nx
          });
          nx = nx + dx;
          ny = ny + dy;
        }
        if ((nx >= 1) && (nx <= this.field_size) && (ny >= 1) && (ny <= this.field_size) && (this.field[ny][nx] === p)) {
          for (_j = 0, _len1 = temp.length; _j < _len1; _j++) {
            t = temp[_j];
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

    ReversiBoard.prototype.do_move = function(m, side) {
      var flip, _i, _len, _ref;
      this.field[m.y][m.x] = side;
      this.counts[side]++;
      _ref = m.flips;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        flip = _ref[_i];
        this.field[flip.y][flip.x] = side;
      }
      this.counts[side] += m.flips.length;
      return this.counts[3 - side] -= m.flips.length;
    };

    ReversiBoard.prototype.score = function() {
      var scoreO, scoreX;
      scoreX = 0;
      scoreO = 0;
      return {
        sx: this.counts[1],
        so: this.counts[2]
      };
    };

    ReversiBoard.prototype.score_side = function(s) {
      return this.counts[s];
    };

    ReversiBoard.prototype.delta_side = function(s) {
      return this.counts[s] - this.counts[3 - s];
    };

    ReversiBoard.prototype.gameOver = function() {
      var i, j, tmpflips, _i, _j, _ref, _ref1;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          tmpflips = this.getFlips(i, j, 1);
          if (tmpflips.length > 0) {
            return 1 === 0;
          }
          tmpflips = this.getFlips(i, j, 2);
          if (tmpflips.length > 0) {
            return 1 === 0;
          }
        }
      }
      return 1 === 1;
    };

    ReversiBoard.prototype.possibleMoves = function(side) {
      var i, j, moves, tmpflips, _i, _j, _ref, _ref1;
      tmpflips = [];
      moves = [];
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          if (this.field[i][j] === 0) {
            tmpflips = this.getFlips(i, j, side);
            if (tmpflips.length > 0) {
              moves.push({
                y: i,
                x: j,
                flips: tmpflips
              });
            }
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

    ReversiBoard.prototype.getState = function(i, j, p) {
      return this.field[i][j];
    };

    ReversiBoard.prototype.opp = function(side) {
      return 3 - side;
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
      var m, maxrate, opp, pm, r, tmp, _i, _len;
      this.board = board;
      opp = 3 - side;
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
          res.rate = r;
        }
      }
      return getRandomM(tmp);
    };

    return SimpleAlg;

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

  MiniMaxABAlg = (function() {
    function MiniMaxABAlg(depth) {
      this.depth = depth;
      this.inf_plus = 10000;
      this.inf_minus = -10000;
      this.cnt = 0;
      this.boards = [];
    }

    MiniMaxABAlg.prototype.newBoard = function(fs) {
      if (this.boards.length > 0) {
        return this.boards.pop();
      } else {
        return new ReversiBoard(fs);
      }
    };

    MiniMaxABAlg.prototype.reuse_board = function(b) {
      return this.boards.push(b);
    };

    MiniMaxABAlg.prototype.opp = function(side) {
      return 3 - side;
    };

    MiniMaxABAlg.prototype.rate = function(board, side) {
      var brd_rnd_rate, corn_rate, fs, i, ii, j, jj, res, _i, _j, _ref, _ref1;
      this.cnt++;
      fs = board.field_size;
      res = board.score_side(side);
      if (!board.gameOver()) {
        corn_rate = 20;
        brd_rnd_rate = 10;
        for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
            if (board.map[i][j].type === 'CORNER') {
              if (board.field[i][j] === side) {
                res += corn_rate;
              }
              if (board.field[i][j] === opp) {
                res -= corn_rate;
              }
            } else {
              if (board.map[i][j].type === 'PRE_CORNER') {
                ii = board.map[i][j].cy;
                jj = board.map[i][j].cx;
                if (board.field[i][j] === side) {
                  if (board.field[ii][jj] === side) {
                    res += brd_rnd_rate;
                  } else {
                    res -= corn_rate;
                  }
                }
              } else {
                if (board.map[i][j].type === '1_LINE') {
                  if (board.field[i][j] === side) {
                    res += brd_rnd_rate;
                  }
                  if (board.field[i][j] === opp) {
                    res -= brd_rnd_rate;
                  }
                }
              }
            }
          }
        }
        return res;
      } else {
        if (board.score_side(side) >= board.score_side(opp)) {
          return this.inf_plus;
        } else {
          return this.inf_minus;
        }
      }
    };

    MiniMaxABAlg.prototype.alfa_beta = function(side, board, level, round) {
      var b, contra, done, m, my_best_rate, opposite, pm, r, t, _i, _j, _k, _len, _len1, _len2;
      if (level === 0 || board.gameOver()) {
        return {
          rate: this.rate(board, side)
        };
      }
      pm = board.possibleMoves(side);
      b = new ReversiBoard(board.field_size);
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
          board.fill(b);
          b.do_move(m, side);
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
        move: getRandomA(t),
        all_moves: t
      };
    };

    MiniMaxABAlg.prototype.bestMoves = function(board, side) {
      var res;
      this.cnt = 0;
      res = (this.alfa_beta(side, board, this.depth, this.inf_plus)).all_moves;
      return res;
    };

    MiniMaxABAlg.prototype.findAnyMove = function(board, side) {
      return getRandomM(this.bestMoves(board, side));
    };

    return MiniMaxABAlg;

  })();

  Heuristic = (function() {
    function Heuristic() {
      this.inf_minus = -10000;
      this.inf_plus = 10000;
    }

    Heuristic.prototype.sf = function() {
      return (function(a, b) {
        return b.flips.length - a.flips.length;
      });
    };

    Heuristic.prototype.pre_filter = function(board, side, pm) {
      var cntr, corners, done, l1, l2, m0, pc, t, z, _i, _len;
      corners = [];
      pc = [];
      l1 = [];
      l2 = [];
      cntr = [];
      for (_i = 0, _len = pm.length; _i < _len; _i++) {
        m0 = pm[_i];
        done = 1 === 0;
        t = board.map[m0.y][m0.x].type;
        if (t === 'CORNER') {
          corners.push(m0);
        }
        if (t === 'PRE_CORNER') {
          pc.push(m0);
        }
        if (t === '1_LINE') {
          l1.push(m0);
        }
        if (t === '2_LINE') {
          l2.push(m0);
        }
        if (t === 'CENTER') {
          cntr.push(m0);
        }
      }
      done = 1 === 0;
      z = [];
      if (corners.length > 0) {
        z = corners;
        done = 1 === 1;
      }
      if (!done && l1.length > 0) {
        z = l1;
        done = 1 === 1;
      }
      if (!done && cntr.length > 0) {
        z = cntr;
        done = 1 === 1;
      }
      if (!done && l2.length > 0) {
        z = l2;
        done = 1 === 1;
      }
      if (!done && pc.length > 0) {
        z = pc;
        done = 1 === 1;
      }
      if (z.length === 0) {
        z = pm;
      }
      z.sort(this.sf());
      return z;
    };

    Heuristic.prototype.rate = function(board, side) {
      var brd_rnd_rate, corn_rate, cx, cy, fs, i, j, opp, res, t, _i, _j, _ref, _ref1;
      this.cnt++;
      fs = board.field_size;
      res = board.score_side(side);
      if (!board.gameOver()) {
        corn_rate = 40;
        brd_rnd_rate = 20;
        for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
            t = board.map[i][j].type;
            cx = board.map[i][j].cx;
            cy = board.map[i][j].cy;
            if (t === 'CORNER') {
              if (board.field[i][j] === side) {
                res += corn_rate;
              }
              if (board.field[i][j] === opp) {
                res -= corn_rate;
              }
            } else {
              if (t === 'PRE_CORNER') {
                if (board.field[i][j] === side) {
                  if (board.field[cy][cx] === side) {
                    res += brd_rnd_rate;
                  } else {
                    res -= corn_rate;
                  }
                }
              } else {
                if (t === '1_LINE') {
                  if (board.field[i][j] === side) {
                    res += brd_rnd_rate;
                  }
                  if (board.field[i][j] === opp) {
                    res -= brd_rnd_rate;
                  }
                }
              }
            }
          }
        }
        return res;
      } else {
        opp = 3 - side;
        if (board.score_side(side) >= board.score_side(opp)) {
          return this.inf_plus;
        } else {
          return this.inf_minus;
        }
      }
    };

    return Heuristic;

  })();

  MinMaxExAlg = (function() {
    function MinMaxExAlg(depth) {
      this.heur = new Heuristic();
      this.depth = depth;
      this.boards = [];
      this.inf_minus = this.heur.inf_minus;
      this.inf_plus = this.heur.inf_plus;
    }

    MinMaxExAlg.prototype.newBoard = function(fs) {
      if (this.boards.length > 0) {
        return this.boards.pop();
      } else {
        return new ReversiBoard(fs);
      }
    };

    MinMaxExAlg.prototype.reuse_board = function(b) {
      return this.boards.push(b);
    };

    MinMaxExAlg.prototype.mx_mn = function(board, side, alpha, depth) {
      var b, b2, best_moves, curr_rate, m, mopp, opp, r, res, res_rate, rez_rate, rr, sf, z, zz, _i, _j, _len, _len1, _ref;
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
      b = this.newBoard(board.field_size);
      b2 = this.newBoard(board.field_size);
      res_rate = this.inf_minus;
      best_moves = [];
      sf = function(a, b) {
        return b.flips.length - a.flips.length;
      };
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

    MinMaxExAlg.prototype.bestMoves = function(board, side) {
      this.cnt = 0;
      return this.mx_mn(board, side, this.inf_plus, this.depth).moves;
    };

    MinMaxExAlg.prototype.findAnyMove = function(board, side) {
      return getRandomM(this.bestMoves(board, side));
    };

    return MinMaxExAlg;

  })();

  Reversi2 = (function() {
    function Reversi2() {
      this.alg = new MinMaxExAlg(4);
      this.undo_data = [];
    }

    Reversi2.prototype.clicker = function(i, j) {
      return (function(_this) {
        return function(event) {
          return _this.onCellClick(i, j);
        };
      })(this);
    };

    Reversi2.prototype.onCellClick = function(i, j) {
      var done, flips, myMove, r, si;
      if (this.state === 'busy') {
        alert('Я еще думаю');
        return;
      }
      si = {
        board: this.rb.clone(),
        depth: this.alg.depth
      };
      this.undo_data.push(si);
      flips = this.rb.getFlips(i, j, 1);
      if (flips.length > 0) {
        this.rb.do_move({
          y: i,
          x: j,
          flips: flips
        }, 1);
        this.last_x = {
          y: i,
          x: j
        };
      } else {
        r = this.rb.possibleMoves(1);
        if (r.length > 0) {
          alert("Ход неверен, есть возможность правильного хода");
          this.state = 'ready';
          return;
        }
      }
      if (this.rb.gameOver()) {
        alert("Game over!");
        this.state = 'ready';
        return;
      }
      this.draw();
      if (this.rb.possibleMoves(2).length > 0) {
        r = this.findAnyMove(2);
        myMove = 1 === 1;
      } else {
        myMove = 1 === 0;
      }
      done = this.rb.gameOver();
      this.last_o = [];
      this.state = 'busy';
      this.span_state.html('....Задумался....');
      while (myMove && (!done)) {
        if (r.flips.length > 0) {
          this.rb.do_move(r, 2);
          this.last_o.push({
            y: r.y,
            x: r.x
          });
        }
        if (this.rb.possibleMoves(1).length > 0) {
          myMove = 1 === 0;
        } else {
          r = this.findAnyMove(2);
          done = r.flips.length === 0;
        }
      }
      this.draw();
      this.state = 'ready';
      this.span_state.html('Просмотрено ' + this.alg.cnt + ' позиций глубина ' + this.alg.depth);
      if (this.rb.gameOver()) {
        alert("Game over!");
      }
    };

    Reversi2.prototype.findAnyMove = function(side) {
      var res;
      res = this.alg.findAnyMove(this.rb, side);
      if (this.alg.cnt > 30000) {
        if (this.alg.depth > 0) {
          this.alg.depth--;
        }
      }
      if (this.alg.cnt < 1000) {
        if (this.alg.depth < 7) {
          this.alg.depth++;
        }
      }
      return res;
    };

    Reversi2.prototype.calc = function() {
      var s;
      s = this.rb.score();
      this.spanX.html(s.sx);
      return this.spanO.html(s.so);
    };

    Reversi2.prototype.doUndo = function() {
      var uu;
      if (this.undo_data.length > 0) {
        uu = this.undo_data.pop();
        uu.board.fill(this.rb);
        this.alg.depth = uu.depth;
        return this.draw();
      }
    };

    Reversi2.prototype.deftag = function(side) {
      if (side === 1) {
        return '<b>X</b>';
      }
      if (side === 2) {
        return '<b>O</b>';
      }
      return '';
    };

    Reversi2.prototype.view = function(mode) {
      this.mode = mode;
      if (mode === 0) {
        this.xtag = this.deftag(1);
        this.otag = this.deftag(2);
      }
      if (mode === 1) {
        this.xtag = '<b>#</b>';
        this.otag = '<b>#</b>';
      }
      if (mode === 2) {
        this.xtag = ' ';
        this.otag = ' ';
      }
      return this.draw();
    };

    Reversi2.prototype.draw = function() {
      var i, j, pm, t, _i, _j, _k, _l, _len, _len1, _ref, _ref1, _ref2, _ref3, _results;
      this.calc();
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          switch (this.rb.getState(i, j)) {
            case 0:
              this.field[i][j].html(' ');
              break;
            case 1:
              this.field[i][j].html(this.xtag);
              break;
            case 2:
              this.field[i][j].html(this.otag);
          }
        }
      }
      if (this.undo_data.length > 0) {
        this.field[this.last_x.y][this.last_x.x].html(this.deftag(this.rb.field[this.last_x.y][this.last_x.x]));
        _ref2 = this.last_o;
        for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
          t = _ref2[_k];
          this.field[t.y][t.x].html(this.deftag(this.rb.field[t.y][t.x]));
        }
      }
      _ref3 = this.rb.possibleMoves(1);
      _results = [];
      for (_l = 0, _len1 = _ref3.length; _l < _len1; _l++) {
        pm = _ref3[_l];
        _results.push(this.field[pm.y][pm.x].html('?'));
      }
      return _results;
    };

    Reversi2.prototype.init = function() {
      var btn_cons, btn_greedy, btn_undo, btn_view_all, btn_view_none, btn_view_space, cell, ctrldiv, i, j, row, tbl, _i, _j, _ref, _ref1;
      ctrldiv = $('<div></div>');
      btn_cons = $('<p>Компьютер ирает:</p>').appendTo(ctrldiv);
      btn_greedy = $('<button>Минимаксом</button>').appendTo(ctrldiv);
      btn_greedy.click((function(_this) {
        return function() {
          return _this.initField();
        };
      })(this));
      $('<p></p>').appendTo(ctrldiv);
      $('<span>X:</span>').appendTo(ctrldiv);
      this.spanX = $('<span></span>').appendTo(ctrldiv);
      $('<p></p>').appendTo(ctrldiv);
      $('<span>O:</span>').appendTo(ctrldiv);
      this.spanO = $('<span></span>').appendTo(ctrldiv);
      $('<p></p>').appendTo(ctrldiv);
      $('<p>Отображать доску:</p>').appendTo(ctrldiv);
      btn_view_all = $('<button>Все</button>').appendTo(ctrldiv);
      btn_view_all.click((function(_this) {
        return function() {
          return _this.view(0);
        };
      })(this));
      btn_view_space = $('<button>Занятые</button>').appendTo(ctrldiv);
      btn_view_space.click((function(_this) {
        return function() {
          return _this.view(1);
        };
      })(this));
      btn_view_none = $('<button>Ничего</button>').appendTo(ctrldiv);
      btn_view_none.click((function(_this) {
        return function() {
          return _this.view(2);
        };
      })(this));
      $('<p></p>').appendTo(ctrldiv);
      btn_undo = $('<button>Отмена</button>').appendTo(ctrldiv);
      btn_undo.click((function(_this) {
        return function() {
          return _this.doUndo();
        };
      })(this));
      this.span_state = $('<span></span>').appendTo(ctrldiv);
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
      this.last_o = [];
      this.last_x = {
        x: 0,
        y: 0
      };
      this.view(0);
      this.undo_data = [];
      this.alg.depth = 6;
      return this.state = 'ready';
    };

    return Reversi2;

  })();

  reversi = new Reversi2;

  window.g_reversi = reversi;

  $(document).ready(function() {
    return reversi.init();
  });

  MinMaxAlg = (function() {
    function MinMaxAlg(depth) {
      this.depth = depth;
      this.boards = [];
    }

    MinMaxAlg.prototype.newBoard = function(fs) {
      if (this.boards.length > 0) {
        return this.boards.pop();
      } else {
        return new ReversiBoard(fs);
      }
    };

    MinMaxAlg.prototype.reuse_board = function(b) {
      return this.boards.push(b);
    };

    MinMaxAlg.prototype.rate = function(board, side) {
      var fs, i, j, opp, res, _i, _j, _ref, _ref1;
      opp = side === 1 ? 2 : 1;
      fs = board.field_size;
      res = board.score_side(side);
      if (!board.gameOver()) {
        for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
            if (board.isCorner(i, j) && board.field[i][j] === side) {
              res += 15;
            }
            if (board.isCorner(i, j) && board.field[i][j] === opp) {
              res -= 15;
            }
            if (board.isPreCorner(i, j) && board.field[i][j] === side) {
              res -= 15;
            }
            if (board.isPreCorner(i, j) && board.field[i][j] === opp) {
              res += 15;
            }
          }
        }
      }
      return res;
    };

    MinMaxAlg.prototype.boardScore = function(board, side, depth) {
      this.cnt++;
      if ((depth === 0) || (board.gameOver())) {
        return this.rate(board, side);
      } else {
        return this.mx_mn(board, side, depth - 1);
      }
    };

    MinMaxAlg.prototype.mx_mn = function(board, side, depth) {
      var b, b2, curr_rate, m, mopp, opp, r, res, rr, _i, _j, _len, _len1, _ref, _ref1;
      opp = side === 1 ? 2 : 1;
      if (board.gameOver()) {
        return board.score_side(side);
      }
      b = this.newBoard(board.field_size);
      b2 = this.newBoard(board.field_size);
      res = -1000;
      _ref = board.possibleMoves(side);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        board.fill(b);
        b.do_move(m, side);
        if (b.gameOver()) {
          curr_rate = b.score_side(side);
        } else {
          r = 1000;
          _ref1 = b.possibleMoves(opp);
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            mopp = _ref1[_j];
            b.fill(b2);
            b2.do_move(mopp, opp);
            if (b2.gameOver() || this.cnt > 120000) {
              rr = this.rate(b2, side);
            } else {
              rr = this.boardScore(b2, side, depth);
            }
            if (rr < r) {
              r = rr;
            }
          }
          curr_rate = r;
        }
        if (curr_rate > res) {
          res = curr_rate;
        }
      }
      this.reuse_board(b);
      this.reuse_board(b2);
      return res;
    };

    MinMaxAlg.prototype.bestMoves = function(board, side) {
      var b, b2, m, minrate, opp, pm, r, tmp, _i, _j, _len, _len1;
      this.cnt = 0;
      opp = side === 1 ? 2 : 1;
      pm = board.possibleMoves(side);
      b = this.newBoard(board.field_size);
      b2 = this.newBoard(board.field_size);
      minrate = 1000;
      for (_i = 0, _len = pm.length; _i < _len; _i++) {
        m = pm[_i];
        board.fill(b);
        b.do_move(m, side);
        if (b.gameOver()) {
          if (b.score_side(side) > b.score_side(opp)) {
            r = -1000;
          } else {
            r = 1000;
          }
        } else {
          r = this.boardScore(b, opp, this.depth);
          m.rate = r;
          if (minrate > r) {
            minrate = r;
          }
        }
      }
      tmp = [];
      for (_j = 0, _len1 = pm.length; _j < _len1; _j++) {
        m = pm[_j];
        if (m.rate === minrate) {
          tmp.push(m);
        }
      }
      this.reuse_board(b);
      this.reuse_board(b2);
      return tmp;
    };

    MinMaxAlg.prototype.findAnyMove = function(board, side) {
      return getRandomM(this.bestMoves(board, side));
    };

    return MinMaxAlg;

  })();

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
        b.do_move(m, side);
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
      return getRandomM(this.bestMoves(board, side));
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
        b.do_move(m, side);
        if ((board.possibleMoves(opp)).length > 0) {
          a = this.preAlg.findAnyMove(board, opp);
          m.rate = this.preAlg.moveRate(m) - a.rate;
        } else {
          m.rate = this.preAlg.moveRate(m);
        }
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
      return getRandomM(this.bestMoves(board, side));
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
        b.do_move(m, side);
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
              rm = a.findAnyMove(b, opp);
              b.do_move(rm, opp);
            }
            rpm = b.possibleMoves(side);
            if (rpm.length > 0) {
              gameOver = 1 === 0;
              a = getRandomA(algs);
              rm = a.findAnyMove(b, side);
              b.do_move(rm, side);
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
      return getRandomM(this.bestMoves(board, side));
    };

    return MonteAlg;

  })();

}).call(this);
