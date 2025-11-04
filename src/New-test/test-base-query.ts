import 'reflect-metadata';
import { Type, plainToInstance } from 'class-transformer';

enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

class BaseQueryParams {
  @Type(() => Number)
  pageNumber: number = 1;

  @Type(() => Number)
  pageSize: number = 10;

  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

// имитация того, что Nest получил query параметры из URL
const plainQuery = {
  pageNumber: '4',
  pageSize: '11',
  sortDirection: 'asc',
};

// "преобразуем" их в экземпляр класса
const query = plainToInstance(BaseQueryParams, plainQuery);

console.log('Экземпляр класса:', query);
console.log('Тип pageNumber:', typeof query.pageNumber);
console.log('Результат calculateSkip():', query.calculateSkip());
