import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles, createStyles, makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      //width: '100%',
      display: 'flex'
    },
    rightButtons: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    rightButton: {
      margin: '1em',
      maxWidth: '160px'
    }
  }),
)

const tableStyles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
      backgroundColor: 'LightGrey'
    },
  },
  tableRow: {
    cursor: 'pointer',
    '&:selected': {
      backgroundColor: theme.palette.grey[400],
    }
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});

class MuiVirtualizedTable extends React.PureComponent {

  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        { columns[columnIndex].href 
          ? <a href={columns[columnIndex].href + cellData} target="_blank" title={columns[columnIndex].hrefTitle}>{cellData}</a> 
          : cellData
        }
        
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label} { columns[columnIndex].onHelp && <IconButton aria-label="help" size="small" onClick={columns[columnIndex].onHelp}>
              <HelpOutlineIcon fontSize="inherit" />
              </IconButton>  }</span>
      </TableCell>
    );
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;

    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
      href: PropTypes.string,
      hrefTitle: PropTypes.string
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

const VirtualizedTable = withStyles(tableStyles)(MuiVirtualizedTable);

export default function ReactVirtualizedTable(props) {

  const { data, columns, onDownload, downloadText, onSelectRow, width, height, headerHeight } = props

  const classes = useStyles();

  const onRowClick = (event) => {
    onSelectRow && onSelectRow(event.rowData)
  }

  return (
    <div className={classes.container}>
      <Paper style={{ height: height ? height : 'auto', width: width }}>
        <VirtualizedTable
          rowCount={data.length}
          rowGetter={({ index }) => data[index]}
          onRowClick={onRowClick}
          columns={columns}
          headerHeight={headerHeight}
        />
      </Paper>
      {
      onDownload && <div className={classes.rightButtons}>
        <Button className={classes.rightButton} variant="contained" color="primary" onClick={onDownload}>
          {downloadText ? downloadText : 'Download'}
        </Button>
      </div>
      }
    </div>
  );
}