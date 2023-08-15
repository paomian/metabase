/* eslint-disable react/prop-types */
import { Component } from "react";
import { connect } from "react-redux";
import { t } from "ttag";
import _ from "underscore";

import Button from "metabase/core/components/Button";
import BulkActionBar from "metabase/components/BulkActionBar";
import Card from "metabase/components/Card";
import PageHeading from "metabase/components/type/PageHeading";
import StackedCheckBox from "metabase/components/StackedCheckBox";
import VirtualizedList from "metabase/components/VirtualizedList";

import Search from "metabase/entities/search";
import listSelect from "metabase/hoc/ListSelect";

import { getIsNavbarOpen, openNavbar } from "metabase/redux/app";
import { getUserIsAdmin } from "metabase/selectors/user";
import { getCollectionsById } from "metabase/selectors/collection";
import { isSmallScreen, getMainElement } from "metabase/lib/dom";
import ArchivedItem from "../../components/ArchivedItem";

import {
  ArchiveBarContent,
  ArchiveBarText,
  ArchiveBody,
  ArchiveEmptyState,
  ArchiveHeader,
  ArchiveRoot,
} from "./ArchiveApp.styled";

const mapStateToProps = (state, props) => ({
  isNavbarOpen: getIsNavbarOpen(state),
  isAdmin: getUserIsAdmin(state, props),
  collectionsById: getCollectionsById(state),
});

const mapDispatchToProps = {
  openNavbar,
};

const ROW_HEIGHT = 68;

class ArchiveApp extends Component {
  constructor(props) {
    super(props);
    this.mainElement = getMainElement();
    this.state = {
      writableList: [],
    };
  }

  componentDidMount() {
    if (!isSmallScreen()) {
      this.props.openNavbar();
    }

    this.setWritableList();
  }

  componentDidUpdate(prevProps) {
    this.setWritableList({ prevList: prevProps.list });
  }

  setWritableList({ prevList } = { prevList: [] }) {
    const { isAdmin, list, collectionsById } = this.props;

    if (_.isEqual(prevList, list)) {
      return;
    }

    const newWritableList = isAdmin
      ? list
      : list.filter(
          item => collectionsById?.[item.getCollection().id]?.can_write,
        );

    this.setState({
      writableList: newWritableList,
    });
  }

  render() {
    const {
      isAdmin,
      isNavbarOpen,
      reload,
      selected,
      selection,
      onToggleSelected,
    } = this.props;
    const { writableList } = this.state;

    return (
      <ArchiveRoot>
        <ArchiveHeader>
          <PageHeading>{t`Archive`}</PageHeading>
        </ArchiveHeader>
        <ArchiveBody>
          <Card
            style={{
              height:
                writableList.length > 0
                  ? ROW_HEIGHT * writableList.length
                  : "auto",
            }}
          >
            {writableList.length > 0 ? (
              <VirtualizedList
                scrollElement={this.mainElement}
                items={writableList}
                rowHeight={ROW_HEIGHT}
                renderItem={({ item }) => (
                  <ArchivedItem
                    type={item.type}
                    name={item.getName()}
                    icon={item.getIcon().name}
                    color={item.getColor()}
                    isAdmin={isAdmin}
                    onUnarchive={
                      item.setArchived
                        ? async () => {
                            await item.setArchived(false);
                            reload();
                          }
                        : null
                    }
                    onDelete={
                      item.delete
                        ? async () => {
                            await item.delete();
                            reload();
                          }
                        : null
                    }
                    selected={selection.has(item)}
                    onToggleSelected={() => onToggleSelected(item)}
                    showSelect={selected.length > 0}
                  />
                )}
              />
            ) : (
              <ArchiveEmptyState>
                <h2>{t`Items you archive will appear here.`}</h2>
              </ArchiveEmptyState>
            )}
          </Card>
        </ArchiveBody>
        <BulkActionBar
          isNavbarOpen={isNavbarOpen}
          showing={selected.length > 0}
        >
          <ArchiveBarContent>
            <SelectionControls {...this.props} />
            <BulkActionControls {...this.props} />
            <ArchiveBarText>{t`${selected.length} items selected`}</ArchiveBarText>
          </ArchiveBarContent>
        </BulkActionBar>
      </ArchiveRoot>
    );
  }
}

export default _.compose(
  Search.loadList({
    query: { archived: true },
    reload: true,
    wrapped: true,
  }),
  listSelect({ keyForItem: item => `${item.model}:${item.id}` }),
  connect(mapStateToProps, mapDispatchToProps),
)(ArchiveApp);

const BulkActionControls = ({ selected, reload }) => (
  <span>
    <Button
      className="ml1"
      medium
      onClick={async () => {
        try {
          await Promise.all(
            selected.map(item => item.setArchived && item.setArchived(false)),
          );
        } finally {
          reload();
        }
      }}
    >{t`Unarchive`}</Button>
    <Button
      className="ml1"
      medium
      onClick={async () => {
        try {
          await Promise.all(selected.map(item => item.delete && item.delete()));
        } finally {
          reload();
        }
      }}
    >{t`Delete`}</Button>
  </span>
);

const SelectionControls = ({ deselected, onSelectAll, onSelectNone }) =>
  deselected.length === 0 ? (
    <StackedCheckBox checked={true} onChange={onSelectNone} />
  ) : (
    <StackedCheckBox checked={false} onChange={onSelectAll} />
  );
