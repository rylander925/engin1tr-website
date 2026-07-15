import { useState, useEffect, useMemo } from 'react'

//Time dependent item generator
//TODO: Determine whether index should be stored inside of the class
export class Generator {

    //Generates items acording to B*t + S*t^2 where B is base interval, S is slowdown factor
    constructor(baseInterval, slowdownFactor, seed) {
        this.baseInterval = baseInterval;
        this.slowdownFactor = slowdownFactor;
        this.seed = seed;

        //Chooses a new seed per generated item based on its index. 9781 is a largish odd number used to make seeds as differentiated as possible
        this.rngForIndex = (i) => Generator.mulberry32(this.seed + i * 9781);
    }

    //Return the elapsed time at which nth plant appears
    timeForIndex(n) {
        return n * this.baseInterval + this.slowdownFactor * (n ** 2)
    }

    //Return the number of plants (called index for consistency) at a given elapsed time
    indexForTime(elapsedTime) {
        if(this.slowdownFactor == 0) {
            return Math.max(0, elapsedTime/this.baseInterval)
        }
        const a = this.slowdownFactor, b = this.baseInterval, c = -elapsedTime;
        const solution = (-b + Math.sqrt(b**2 - 4*a*c)) / (2*a);
        return Math.max(0, Math.floor(solution));
    }

    //Returns a PRNG. You can search up 'mulberry32' for details, this function is well documented.
    static mulberry32(seed) {
        return function () {
            seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    //Generates a PRNG for the item and passes it to generateItemAttributes, which uses the PRNG to generate item specific attributes
    generateItem(index) {
        index = index + 1;
        const rand = this.rngForIndex(index);
        return this.generateItemAttributes(rand, index);
    }

     //Return a dictionary of attributes for item to pass to Generable function
    generateItemAttributes(rand, index) {
        //rand is a PRNG, call as rand() 
        throw new Error("Abstract method generateItemAttributes(rand, index) must be implemented by subclass");
    }

    //generate full list at given time
    generateAt(elapsedTime) {
        return Array.from({ length:this.indexForTime(elapsedTime) }, (_, i) => this.generateItem(i));
    }

    //Generates an array of a specified amount of item attributes.
    //Since PRNG is deterministic based on index, use indexShift to adjust the seed for each item.
        //E.g. if indexShift is 0, an amount of 30 will always generate the same 30 items. Using indexShift of 30 will generate 30 new items, while indexShift 15 will still have 15 of the old items.
    generateAmount(amount, indexShift) {
        return Array.from({ length:(amount) }, (_, i) => this.generateItem(i + indexShift));
    }

    //Custom hook that calls useMemo. Generates and returns a memoized array of item attributes. Update indexshift, amount, or seed to regenerate items
    useGenerableAmount(amount, indexShift) {
        return useMemo( 
            () => this.generateWindow(amount, indexShift),
            [amount, indexShift, this.seed]
        )
    }

    //Custom hook that calls useMemo. Generates and returns a memoized array of item attributes based on the given time. Updates when time changes, or when generation conditions (baseinterval, slowdownfactor, seed) change.
    useGenerableAtTime(elapsedTime) {
        return useMemo(
                () => this.generateAt(elapsedTime), 
                [elapsedTime, this.baseInterval, this.slowdownFactor, this.seed]
            );  
    }

    //Subclass should implement method that generates an appropriate div
}