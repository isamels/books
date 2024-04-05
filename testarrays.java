package towerofhanoi;

import java.util.ArrayList;

public class testarrays {
    public static void debug(ArrayList<Integer> a){
        for(int i = 0; i < a.size(); i++){
            System.out.print(a.get(i) + " ");
        }
        System.out.println("");
    }

    public static void addNum(int num, ArrayList<Integer> a){
        a.add(num);
    }

    public static void copy(ArrayList<Integer> a, ArrayList<Integer> b){ //transfer all elements from b to a
        a.clear();
        for(int i = 0; i < b.size(); i++){
            a.add(b.get(i));
        }
    }

    public static void main (String args[]){
        ArrayList<Integer> peg1 = new ArrayList<Integer>();
        ArrayList<Integer> peg2 = new ArrayList<Integer>();
        ArrayList<Integer> peg3 = new ArrayList<Integer>();
        peg1.add(1);
        copy(peg2, peg1);
        addNum(2, peg2);
        debug(peg1);
        debug(peg2);
    }
}
