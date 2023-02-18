//define a linear Spline class
//https://en.wikipedia.org/wiki/Spline_(mathematics)
//https://www.youtube.com/watch?v=OFqENgtqRAY&t=278s
//https://www.youtube.com/watch?v=bC4xJzbKNd0
//checking what size, colour, transarency should be assigned at aparticular point in particle's life

export class Spline {
    constructor(lerp) {
      this._points = [];
      this._lerp = lerp;
    }
  
    AddPoint(t, d) {
      this._points.push([t, d]);
    }
    //@params tm is the time passed in function _UpdateFireParticles/fire.js
    //p1 assigned to 0 (fire point1)
    // loops through the "_points" array and checks if the first element of each tuple is greater than or equal to "tm"
    // yes - breaks / no- p1 updated to the current index i.

    //  p2 is assigned the minimum of the _points.length-1 and p1+1.(fire point2)

    // if p1 == p2, return the second point at index p1 (_points[p1][1])

    //else return lerp function passed as an argument in fire.js

    /**
     *lerp function is a standard linear interpolation function that takes in 2 values(a,b) and a weighting 
     *factor(t),  and returns  the weighted average of the two values(a,b). 
     */
    
    Get(tm) {
      let p1 = 0;
  
      for (let i = 0; i < this._points.length; i++) {
        //access the first point [0] passed in the fire.js
        if (this._points[i][0] >= tm) {
          break;
        }
        p1 = i;
      }
  
      const p2 = Math.min(this._points.length - 1, p1 + 1);
  
      if (p1 == p2) {
        return this._points[p1][1];
      }
  
      return this._lerp(
        ( tm - this._points[p1][0] ) / ( this._points[p2][0] - this._points[p1][0] ), this._points[p1][1], this._points[p2][1]
        );
    }
  }