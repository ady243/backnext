"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSortParam = void 0;
const buildSortParam = (sort, timestamps) => {
    let sortProperty;
    let sortOrder = 'desc';
    if (!sort) {
        if (timestamps) {
            sortProperty = 'createdAt';
        }
        else {
            sortProperty = '_id';
        }
    }
    else if (sort.indexOf('-') === 0) {
        sortProperty = sort.substring(1);
    }
    else {
        sortProperty = sort;
        sortOrder = 'asc';
    }
    if (sortProperty === 'id')
        sortProperty = '_id';
    return [sortProperty, sortOrder];
};
exports.buildSortParam = buildSortParam;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRTb3J0UGFyYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9uZ29vc2UvYnVpbGRTb3J0UGFyYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQU8sTUFBTSxjQUFjLEdBQUcsQ0FBQyxJQUFZLEVBQUUsVUFBbUIsRUFBRSxFQUFFO0lBQ2xFLElBQUksWUFBb0IsQ0FBQztJQUN6QixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUM7SUFFdkIsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNULElBQUksVUFBVSxFQUFFO1lBQ2QsWUFBWSxHQUFHLFdBQVcsQ0FBQztTQUM1QjthQUFNO1lBQ0wsWUFBWSxHQUFHLEtBQUssQ0FBQztTQUN0QjtLQUNGO1NBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNsQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQztTQUFNO1FBQ0wsWUFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixTQUFTLEdBQUcsS0FBSyxDQUFDO0tBQ25CO0lBRUQsSUFBSSxZQUFZLEtBQUssSUFBSTtRQUFFLFlBQVksR0FBRyxLQUFLLENBQUM7SUFFaEQsT0FBTyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuQyxDQUFDLENBQUM7QUFwQlcsUUFBQSxjQUFjLGtCQW9CekIifQ==