import { useState, useEffect, useMemo } from 'react'

//Time dependent item generator
//TODO: Determine whether index should be stored inside of the class
export class Generator {
    constructor(baseInterval, slowdownFactor, seed) {
        this.baseInterval = baseInterval;
        this.slowdownFactor = slowdownFactor;
        this.seed = seed;

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

    static mulberry32(seed) {
        return function () {
            seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

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

    //generates list of members alive at the current time
    generateWindow(elapsedTime, lifespan) {
        const total = this.indexForTime(elapsedTime);
        const totalBefore = Math.max(0, this.indexForTime(elapsedTime - lifespan))
        console.log(this.generateItem(10 ))
        return Array.from({ length:(total - totalBefore) }, (_, i) => this.generateItem(i + totalBefore));
    }

    useGenerableAtWindow(elapsedTime, lifespan) {
        return useMemo( 
            () => this.generateWindow(elapsedTime, lifespan),
            [elapsedTime, lifespan, this.seed, this.baseInterval]
        )
    }

    useGenerableAtTime(elapsedTime) {
        return useMemo(
                () => this.generateAt(elapsedTime), 
                [elapsedTime, this.seed]
            );  
    }

    //Subclass should implement method that generates an appropriate div
}