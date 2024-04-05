package towerofhanoi;

import java.util.ArrayList;

public class solution {
    static ArrayList<Integer> stack1 = new ArrayList<Integer>();
    static ArrayList<Integer> stack2 = new ArrayList<Integer>();
    static ArrayList<Integer> stack3 = new ArrayList<Integer>();

    public static int solve(ArrayList<Integer> a, ArrayList<Integer> b, ArrayList<Integer> c, int m, int moves){ //move mth disk from a to c
        //debug(a, b, c, moves, m);
        if(!c.contains(m)){ //m is already in c, skip steps 1 & 2
            //step 1 - move m-1th disk to b
            if(m-1 > 0){ //m is greater than 1
                //System.out.println("step 1");
                if(a.contains(m-1)){ //move m-1
                    moves = solve(a, c, b, m-1, moves);
                }else if(c.contains(m-1)){
                    moves = solve(c, a, b, m-1, moves);
                }else if(b.contains(m-1)){
                    if(a.contains(m-2)){
                        moves = solve(c, a, b, m-1, moves);
                    }else{
                        moves = solve(a, c, b, m-1, moves);
                    }
                }
            }
            //step 2 - move mth disk to c
            //System.out.println("step 2 (before move)");
            //debug(a, b, c, moves, m);
            c.add(a.get(a.size()-1));
            a.remove(a.size()-1);
            moves++;
            //System.out.println("step 2 (after move)");
            //debug(a, b, c, moves, m);
        }

        //step 3 - move m-1th disk to c
        if(m-1 > 0){
            //System.out.println("step 3");
            if(c.contains(m) && a.contains(m-1)){
                moves = solve(a, b, c, m-1, moves);
            }else{
                moves = solve(b, a, c, m-1, moves);
            }
        }

        return moves;
    }

    public static void debug(ArrayList<Integer> a, ArrayList<Integer> b, ArrayList<Integer> c, int moves, int m){
        for(int i = 0; i < a.size(); i++){
            System.out.print(a.get(i) + " ");
        }
        System.out.println("");
        for(int i = 0; i < b.size(); i++){
            System.out.print(b.get(i) + " ");
        }
        System.out.println("");
        for(int i = 0; i < c.size(); i++){
            System.out.print(c.get(i) + " ");
        }
        System.out.println("");
        //System.out.println("Moves: " + moves + ", Current m: " + m);
        System.out.println("----------------------------------------");
    }

    public static void generate(int n){
        int stack = 0;
        for(int i = n; i > 0; i--){
            stack = (int)(Math.random() * 3);
            if(stack == 0){
                stack1.add(i);
            }else if(stack == 1){
                stack2.add(i);
            }else if(stack == 2){
                stack3.add(i);
            }
        }
    }

    public static void copy(ArrayList<Integer> a, ArrayList<Integer> b){ //transfer all elements from b to a
        a.clear();
        for(int i = 0; i < b.size(); i++){
            a.add(b.get(i));
        }
    }
    public static int findSolution(ArrayList<Integer> a, ArrayList<Integer> b, ArrayList<Integer> c, int n){
        if(c.contains(n)){ //stack3 is the goal
            if(b.contains(n-1)){ //start solving from n-1th stack, stack2 is the start
                return solve(b, a, c, n, 0);
            }else{ //stack1 or stack3 is the start
                return solve(a, b, c, n, 0);
            }
        }else if(b.contains(n)){ //stack2 is the goal
            if(c.contains(n-1)){ //stack3 is the start
                return solve(c, a, b, n, 0);
            }else{ //stack1 or stack2 is the start
                return solve(a, c, b, n, 0);
            }
        }else{ //stack1 is the goal
            if(c.contains(n-1)){ //stack3 is the start
                return solve(c, b, a, n, 0);
            }else{ //stack2 or stack1 is the start
                return solve(b, c, a, n, 0);
            }
        }
    }

    public static void main (String args[]){
        int n = 8; //number of disks
        generate(n);
        debug(stack1, stack2, stack3, 0, 0); //print original stacks
        int moves;

        ArrayList<Integer> peg1 = new ArrayList<Integer>();
        ArrayList<Integer> peg2 = new ArrayList<Integer>();
        ArrayList<Integer> peg3 = new ArrayList<Integer>();

        /*
        if(stack3.contains(n)){ //stack3 is the goal
            if(stack2.contains(n-1)){ //start solving from n-1th stack, stack2 is the start
                copy(peg1, stack2); //start
                copy(peg2, stack1); //spare
            }else{ //stack1 or stack3 is the start
                copy(peg1, stack1); //start
                copy(peg2, stack2); //spare
            }
            copy(peg3, stack3); //goal
        }else if(stack2.contains(n)){ //stack2 is the goal
            if(stack3.contains(n-1)){ //stack3 is the start
                copy(peg1, stack3); //start
                copy(peg2, stack1); //spare
            }else{ //stack1 or stack2 is the start
                copy(peg1, stack1); //start
                copy(peg2, stack3); //spare
            }
            copy(peg3, stack2); //goal
        }else{ //stack1 is the goal
            if(stack3.contains(n-1)){ //stack3 is the start
                copy(peg1, stack3); //start
                copy(peg2, stack2); //spare
            }else{ //stack2 or stack1 is the start
                copy(peg1, stack2); //start
                copy(peg2, stack3); //spare
            }
            copy(peg3, stack1); //goal
        }*/

        moves = findSolution(stack1, stack2, stack3, n);
        //moves = solve(peg1, peg2, peg3, n, 0);

        System.out.println("moves: " + moves);
    }
}
