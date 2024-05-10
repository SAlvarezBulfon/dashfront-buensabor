import Row from "./Row";

export default interface Column {
    id: keyof Row; 
    label: string;
    renderCell: (rowData: Row) => JSX.Element; 
  }