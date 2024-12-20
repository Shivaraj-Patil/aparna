import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewContainerRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Employee } from '../../models/employee';
import { ChangeManagerDialogComponent } from '../dialogs/change-manager-dialog/change-manager-dialog.component';
import { CommonModule } from '@angular/common';
import { EditEmployeeDialogComponent } from '../dialogs/edit-employee-dialog/edit-employee-dialog.component';
import { DeleteEmployeeDialogComponent } from '../dialogs/delete-employee-dialog/delete-employee-dialog.component';
import { ClarityModule } from '@clr/angular';
import { AddReporteeDialogComponent } from '../dialogs/add-reportee-dialog/add-reportee-dialog.component';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router'; // Import Router
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/employee.state';
import { Observable } from 'rxjs';
@Component({
  standalone: true,
  imports: [CommonModule, EditEmployeeDialogComponent, DeleteEmployeeDialogComponent, ClarityModule, ChangeManagerDialogComponent, AddReporteeDialogComponent, FormsModule],
		
  selector: 'app-organization-tree',
  template: `
  <div>
  <button (click)="toggleView()" class="btn btn-sm btn-secondary">
    {{ isTreeView ? 'Switch to Grid View' : 'Switch to Tree View' }}
  </button>
</div>
    <figure id="tree"></figure>
    <div id="dropdown-container"></div>
        <ng-template #dialogContainer></ng-template>
  `,
  styleUrls: ['./organization-tree.component.css'],
})
export class OrganizationTreeComponent implements OnInit {
 employees: Employee[] = [];
  filteredData: Employee[] = [];
  isTreeView:boolean=true;
  @ViewChild('dialogContainer', { read: ViewContainerRef, static: true }) dialogContainer!: ViewContainerRef;
  private svg: any;
  private margin = { top: 20, right: 90, bottom: 30, left: 90 };
  private width = 1200 - this.margin.left - this.margin.right;
  private height = 800 - this.margin.top - this.margin.bottom;
  private selectedEmployee: Employee | null = null;
  constructor(private empService: EmployeeService, private router: Router, private store: Store<AppState>) {
    this.empService.loadAllEmployees();
    this.employees = this.empService.employees;
  }

  ngOnInit(): void {
    
    this.empService.loadAllEmployees();
    this.employees = this.empService.employees;
    this.empService.employeesUpdated.subscribe((employees: Employee[]) => {
      console.log("changes")
      this.employees = employees;
      const employeeId = this.getEmployeeIdFromUrl();
      console.log("employeeId",employeeId)
      if (employeeId === null) {
        this.filteredData = [...this.employees]; // If no employee ID, show all employees
      } else {
        if (employeeId !== null) {
          this.filteredData = this.filterHierarchy(+employeeId, this.employees);
      console.log( this.filteredData)
        }
      }
   
    this.updateTree();
    document.addEventListener('click', () => this.closeDropdownMenu());
    });
      const employeeId = this.getEmployeeIdFromUrl();
      if (employeeId === null) {
        this.filteredData = [...this.employees]; // If no employee ID, show all employees
      } else {
        if (employeeId !== null) {
          this.filteredData = this.filterHierarchy(+employeeId, this.employees);
      console.log( this.filteredData)
        }
      }
    this.initializeSvg();
    this.updateTree();
    document.addEventListener('click', () => this.closeDropdownMenu());
  }



  private initializeSvg(): void {
    this.svg = d3
      .select('figure#tree')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  
  private updateTree(): void {
    
    this.svg.selectAll('*').remove();

    console.log(this.filteredData)
    const hierarchicalData = this.buildHierarchy(this.filteredData);

    this.renderTree(hierarchicalData);
  }

  
  private buildHierarchy(flatData: Employee[]): any {
    console.log('Input flatData:', flatData);
  
    // Create a map to store nodes by their IDs
    const idMap = new Map<number, any>();
  
    // Step 1: Initialize map with all employees and empty children
    flatData.forEach(item => {
      idMap.set(item.id, { ...item, children: [] });
    });
  
    // Step 2: Assign children to their respective parent nodes
    flatData.forEach(node => {
      const currentNode = idMap.get(node.id);
      const parent = idMap.get(node.managerId);
  
      if (node.managerId === null) {
        // Special case for CEO or top-most node
        console.log(`Employee ${node.id} is the top-most node (CEO)`);
      } else if (parent) {
        parent.children.push(currentNode);
      } else {
        console.warn(`Manager with ID ${node.managerId} not found for employee ${node.id}`);
      }
    });
  
    // Step 3: Identify the root node
    let root: any = null;
    flatData.forEach(node => {
      if (!flatData.some(emp => emp.id === node.managerId)) {
        root = idMap.get(node.id);
      }
    });
  
    // Step 4: Handle missing root node by falling back to the first employee if needed
    if (!root) {
      console.error('No root node found. Defaulting to first available node.');
      root = flatData.length > 0
        ? { ...flatData[0], children: [] }
        : { id: 0, name: 'Root', designation: 'N/A', children: [] };
    }
  
    // Step 5: Verify and clean up leaf nodes (no children)
    flatData.forEach(node => {
      const currentNode = idMap.get(node.id);
      if (!currentNode.children) {
        currentNode.children = []; // Ensure children property is always an array
      }
    });
  
    return root;
  }
  private renderTree(data: any): void {
    if (!data) {
      console.error('Invalid data: ', data);
      return;
    }
    console.log(data)
    const root = d3.hierarchy(data);

    const treeLayout = d3.tree().nodeSize([200, 150]);
    treeLayout(root);

    const minX = d3.min(root.descendants(), (d: any) => d.x) || 0;
    const maxX = d3.max(root.descendants(), (d: any) => d.x) || 0;
    const minY = d3.min(root.descendants(), (d: any) => d.y) || 0;
    const maxY = d3.max(root.descendants(), (d: any) => d.y) || 0;
  

    const padding = 50; 
    const treeWidth = maxX - minX + this.margin.left + this.margin.right + 2 * padding;
    const treeHeight = maxY - minY + this.margin.top + this.margin.bottom + 2 * padding;
  

    d3.select('svg')
      .attr('width', treeWidth)
      .attr('height', treeHeight);
  

    this.svg.attr(
      'transform',
      `translate(${this.margin.left - minX + padding}, ${this.margin.top - minY + padding})`
    );
  
 
    this.svg
      .selectAll('path.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr(
        'd',
        d3
          .linkVertical()
          .x((d: any) => d.x)
          .y((d: any) => d.y)
      )
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', 2);
  

    const nodes = this.svg
      .selectAll('g.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);

    nodes
      .append('rect')
      .attr('width', 200)
      .attr('height', 100)
      .attr('x', -100)
      .attr('y', -50)
      .attr('rx', 10)
      .attr('ry', 10)
      .style('fill', '#ffffff')
      .style('stroke', '#69b3a2')
      .style('stroke-width', 2);
  
    // Add text to nodes
    nodes
      .append('text')
      .attr('dy', '-20')
      .attr('text-anchor', 'middle')
      .style('font', '14px sans-serif')
      .text((d: any) => `Name: ${d.data.name}`);
  
    nodes
      .append('text')
      .attr('dy', '-5')
      .attr('text-anchor', 'middle')
      .style('font', '12px sans-serif')
      .text((d: any) => `Designation: ${d.data.designation}`);
  
    nodes
      .append('text')
      .attr('dy', '10')
      .attr('text-anchor', 'middle')
      .style('font', '12px sans-serif')
      .text((d: any) => `Manager: ${d.data.managerName || 'None'}`);
  
    nodes
      .append('text')
      .attr('dy', '25')
      .attr('text-anchor', 'middle')
      .style('font', '12px sans-serif')
      .text((d: any) => `ID: ${d.data.id}`);
  
    // Add 3-dot menu
    nodes
      .append('text')
      .attr('x', 80)
      .attr('y', -30)
      .attr('class', 'menu-icon')
      .style('cursor', 'pointer')
      .text('⋮')
      .on('click', (event: MouseEvent, d: any) => this.showDropdownMenu(d.data, event));
      nodes.on('click', (event: MouseEvent, d: any) => this.onEmployeeClicked(d.data.id));
  }
  
  

private closeDropdownMenu(): void {
  d3.select('#dropdown-container').html('');
}


  private showDropdownMenu(employee: Employee, event: MouseEvent): void {
    event.stopPropagation(); 
    this.closeDropdownMenu();
   
    d3.select('#dropdown-container').html('');
  
  
    const dropdownMenu = d3
      .select('#dropdown-container')
      .append('div')
      .attr('class', 'clr-dropdown-menu')
      .style('position', 'absolute')
      .style('top', `${event.pageY}px`)
      .style('left', `${event.pageX}px`)
      .style('background', '#fff')
      .style('box-shadow', '0px 2px 5px rgba(0,0,0,0.2)')
      .style('border-radius', '4px')
      .style('padding', '10px')
      .style('z-index', '10');
  

    dropdownMenu
      .append('button')
      .attr('class', 'clrDropdownItem')
      .style('display', 'block')
      .style('width', '100%')
      .style('margin', '5px 0')
      .text('Edit')
      .on('click', () => this.onEmployeeEdited(employee));
  
   
    if (employee.designation !== 'CEO') {
      dropdownMenu
        .append('button')
        .attr('class', 'clrDropdownItem')
        .style('display', 'block')
        .style('width', '100%')
        .style('margin', '5px 0')
        .text('Delete')
        .on('click', () => this.deleteEmployee(employee));
    }
  
   
    if (employee.designation !== 'CEO') {
      dropdownMenu
        .append('button')
        .attr('class', 'clrDropdownItem')
        .style('display', 'block')
        .style('width', '100%')
        .style('margin', '5px 0')
        .text('Change Manager')
        .on('click', () => this.changeReportingLine(employee));
    }
  
    if (this.canAddReportee(employee.designation)) {
      dropdownMenu
        .append('button')
        .attr('class', 'clrDropdownItem')
        .style('display', 'block')
        .style('width', '100%')
        .style('margin', '5px 0')
        .text('Add Reportee')
        .on('click', () => this.addReportee(employee));
    }
  }
  
  
  canAddReportee(designation: string): boolean {
   
    return designation !== 'Developer';  
  }
  
  private onEmployeeClicked(employeeId: number): void {
    window.open(`/employee/${employeeId}`, '_blank');
}
  private getEmployeeIdFromUrl(): string | null {
    const path = this.router.url.split('/');
    return path.length > 2 ? path[2] : null;
										   
  }
  private filterHierarchy(employeeId: number, employees: Employee[]): Employee[] {
    const filteredEmployees: Employee[] = [];
  
    // Step 1: Find the current employee
    const currentEmployee = employees.find(emp => emp.id === employeeId);
    if (!currentEmployee) {
      console.warn(`Employee with ID ${employeeId} not found.`);
      return [];
    }
  
    // Add the clicked employee itself
    filteredEmployees.push(currentEmployee);
  
    // Step 2: Find and include the manager (parent) of the employee
    const manager = employees.find(emp => emp.id === currentEmployee.managerId);
    if (manager) {
      filteredEmployees.push(manager);
    }
  
    // Step 3: Find and include children of the current employee, if any
    const children = employees.filter(emp => emp.managerId === currentEmployee.id);
    if (children.length > 0) {
      filteredEmployees.push(...children);
    }
  
    console.log('Filtered Employees:', filteredEmployees);
    return filteredEmployees;
  }
  
  
  
  
//   private filterHierarchy(employeeId: number, employees: Employee[]): Employee[] {
//    console.log(employees)
//     const employee = employees.find(emp => emp.id === employeeId);
//     if (!employee) {
//       return [];
//     }
  
//     const filteredEmployees: Employee[] = [];
  
//     // Find the manager of the employee
//     const manager = employees.find(emp => emp.id === employee.managerId);
//     if (manager) {
//       filteredEmployees.push(manager);
//     }
  
//     // Include the employee itself
//     filteredEmployees.push(employee);
// console.log(filteredEmployees)
//     return filteredEmployees;
//   } 

  onEmployeeEdited(employee: Employee) {
   
    this.selectedEmployee ={...employee}
    const componentRef = this.dialogContainer.createComponent(EditEmployeeDialogComponent);
    componentRef.instance.open = true;
    componentRef.instance.employee = this.selectedEmployee;
    componentRef.instance.save.subscribe(() => {
      componentRef.destroy();
   
    });
    componentRef.instance.cancel.subscribe(() => {
      componentRef.destroy();

    });
  }

  deleteEmployee(employee: Employee) {
   
    this.selectedEmployee = { ...employee };
    const componentRef = this.dialogContainer.createComponent(DeleteEmployeeDialogComponent);
    componentRef.instance.open = true;
    componentRef.instance.employee = this.selectedEmployee;
    componentRef.instance.close.subscribe(() => {
      componentRef.destroy();
    });
  }

  changeReportingLine(employee: Employee): void {
   
    this.selectedEmployee = employee;
    const componentRef = this.dialogContainer.createComponent(ChangeManagerDialogComponent);
    componentRef.instance.open = true;
    componentRef.instance.employee = this.selectedEmployee;
    componentRef.instance.close.subscribe(() => {
      componentRef.destroy();
    });
  }   
  addReportee(employee: Employee) {
   
    this.selectedEmployee = { ...employee };
    const componentRef = this.dialogContainer.createComponent(AddReporteeDialogComponent);
    componentRef.instance.open = true;
    componentRef.instance.manager = this.selectedEmployee;
    componentRef.instance.close.subscribe(() => {
      componentRef.destroy();
      this.empService.onReporteeAdded();
    });
  }
  toggleView() {
    this.router.navigate(['/employees']);
  }
 
}