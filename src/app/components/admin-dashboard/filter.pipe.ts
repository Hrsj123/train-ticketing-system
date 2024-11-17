import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchQuery: string): any[] {
    if (!items) return [];
    if (!searchQuery) return items;

    const lowerCaseQuery = searchQuery.toLowerCase();

    return items.filter(item => {
      // Adjust this logic based on your object'sx structure
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowerCaseQuery)
      );
    });
  }

}
