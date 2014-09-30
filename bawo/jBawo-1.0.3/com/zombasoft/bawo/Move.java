/******************************************************************************
** Created:  2000 by Zangaphee Chimombo
** Purpose:  This is Move.java. It extends com.zombasoft.bawo.Board. It controls
**		the main game loop thread.
** Copying:  GNU Public Licence.
** Changes:
**		2010-08-26 ZC
**		Adding standard file headers like this one and class and
**		method headers. Also taking the opportunity to do a code audit
**		in order to remind myself of my code and get ideas about
**		implementing jBawo 2.0 in MaMaL. Possibly.
******************************************************************************/

// package com.zombasoft.bawo;

import java.awt.*;

class Move extends Thread {
    /*
       Class Move does three things:
       1. enables human choice of move,
       2. enables computer choice of move,
       3. animates chosen move in a thread.
    */
    static int srcBowl=-1;
    int destBowl=-1,moveDir=-17;
    boolean khosweDown=false; /* mouse down */

    Move() {
    /* Used for computer moves */ 
        int temp[];
        temp=new int[3];

        Bawo.msg("\nThinking...");
        temp=Bawo.p.bestMove(Bawo.depth);
        /* 21/02/2010. Zanga Chimombo. */
//        System.out.println(Bawo.p.displayGameTree(Bawo.depth, (byte) 1));
        srcBowl=temp[1];
        moveDir=temp[2];

        this.start();
    }

    Move(int index) {
        /* Used for human moves */ 
        /* Called when mousePressed */ 
        khosweDown=true;
        if (srcBowl!=index) return;
        destBowl=srcBowl; // why?
        srcBowl=index;
        Bawo.d.updateBowl(srcBowl,Color.gray);
    }

    void mouseDragged(int index) {
        if (!khosweDown) return;
        if (destBowl==index) return;
        if (destBowl!=-1 && destBowl!=srcBowl)
            Bawo.d.updateBowl(destBowl,Color.white);
        destBowl=index;
        if (srcBowl!=destBowl && (validMove()
        || Bawo.playMode.getSelectedIndex()==0)) {
            Bawo.d.updateBowl(index,Color.gray);
        }
    }

    static void mouseMoved(int index) {
        if (srcBowl!=index) {
            if (srcBowl!=-1) Bawo.d.updateBowl(srcBowl,Color.white);
            if (index!=-1 && Bawo.p.move[index]>-1 &&
            (Bawo.p.side==0 && index<16
            || Bawo.p.side==1 && index>15
            || Bawo.playMode.getSelectedIndex()==0))
                Bawo.d.updateBowl(index,Color.lightGray);
            srcBowl=index;
        }
    }

    void mouseReleased() {
        khosweDown=false;
        if (srcBowl!=-1) Bawo.d.updateBowl(srcBowl,Color.white);

        if (Bawo.playMode.getSelectedItem()=="Re-arrange Board") {
            Bawo.p.moveTokens(srcBowl,destBowl);
            Bawo.m = null;
            return;
        }

        if (destBowl!=-1 && srcBowl!=-1 && validMove()) {
            Bawo.d.updateBowl(destBowl,Color.white);
            this.start();
        }
        else Bawo.m = null;
        destBowl=-1;
    }

    int getDirection() {
        int dir=-17;

        if (srcBowl==-1 || destBowl==-1) dir=-17;
        else if (srcBowl==destBowl) dir=0;
        else if ((srcBowl<16 && destBowl<16) || (srcBowl>=16 && destBowl>=16)) {
            if ((srcBowl+1)%16==destBowl%16) dir=1;
            else if ((destBowl+1)%16==srcBowl%16) dir=-1;
            else dir=-17;
        }
        else dir=-17;
        return dir;
    }

    boolean validMove() {
        boolean legit=false;
        moveDir=getDirection();
        if ((Bawo.p.side==0 && srcBowl<16) || (Bawo.p.side==1 && srcBowl>15)) {
            if (moveDir==-1 && Bawo.p.move[srcBowl]>1) legit=true;
            if (moveDir==1 && (Bawo.p.move[srcBowl]==1 || Bawo.p.move[srcBowl]==3)) {
                legit=true;
            }
            if (moveDir==0 && Bawo.p.contCapture || Bawo.p.contTakata)
                legit=true;
        }
        return legit;
    }

    public void run () {
        /**********************************************************************
        ** Created:  UNKNOWN by Zangaphee Chimombo
        ** Based On:
        ** Purpose:  
        ** Replaces:
        ** Status:   
        ** Inputs:
        ** Outputs:
        ** Returns:
        ** Uses:
        ** Comment:  started for all moves; human or computer.
        ** Requires:
        ** Used by:
        ** Assumptions:
        ** Changes:
        **           2010-11-14  by ZC
        **           Fixed bug #3063331.
        **********************************************************************/
        String comment="", thisPlyr;
        if (Bawo.p.side==0) thisPlyr="Player 1";
        else thisPlyr="Player 2";

        if (Bawo.p.contCapture || Bawo.p.contTakata) {
            if (moveDir!=0) Bawo.msg(">");
            else Bawo.msg("\n"+thisPlyr+" STOPS.");
        }
        else if (!(Bawo.p.contCapture || Bawo.p.contTakata)) {
/* easiest: thisPlayer,nextPlayer,dir strings! */
		/* 2010-11-14 ZC */
		/* adding modulo-16 to else clause */
		/* fixes bug #3063331 */
            if (Bawo.p.side==0) comment=comment+"\nPlayer 1 moves: "+srcBowl;
            else comment=comment+"\nPlayer 2 moves: "+srcBowl%16;
            if (Bawo.p.side==0 && moveDir==-1) comment=comment+"a";
            else if (Bawo.p.side==0) comment=comment+"c";
            if (Bawo.p.side==1 && moveDir==-1) comment=comment+"A";
            else if (Bawo.p.side==1) comment=comment+"C";
        }

        Bawo.msg(comment);
        Bawo.p.updateState(srcBowl%16, moveDir);
        if (Bawo.m==null) return;
        Bawo.m=null;
        /* currently only Player 2 (upper board) is allowed to be computer */
	/* this is easy to change. will be changed. */
        if (Bawo.p.side==1 && !Bawo.p.gameOver
        && Bawo.p2Level.getSelectedItem()!="human") {
            /* Start computer move */
            Bawo.m=new Move();
        }
    }
}

