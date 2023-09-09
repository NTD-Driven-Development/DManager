import { ExportItem } from "~/composables/api/export";
import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import _ from 'lodash';

export const createBoarderSheet = (workbook: ExcelJS.Workbook, exportItem: ExportItem, title: string = '統計表') => {
    const sheet = workbook?.addWorksheet(title);
    const boarder = exportItem?.boarder;
    const pointLogs = exportItem?.point_logs;
    const telCardLogs = exportItem?.tel_card_logs;
    
    // Header
    let headerRows = sheet.addRows([
        Array(16).fill('國立臺中科技大學'),
        Array(16).fill('學生宿舍住宿生加扣點及電話卡明細'),
    ]);
    for(const it of headerRows) {
        sheet.mergeCells(it?.number, 1, it?.number, 16);
    }


    // Boarder
    const boarderRow = sheet.addRow(
        _.flatten([
            Array(2).fill('樓寢床'), Array(2).fill(checkValueEmpty(boarder?.project_bunk, (v) => toStringlish(v))),
            Array(2).fill('班級'), Array(2).fill(checkValueEmpty(boarder?.class?.name)),
            Array(2).fill('學號'), Array(2).fill(checkValueEmpty(boarder?.sid)),
            Array(2).fill('姓名'), Array(2).fill(checkValueEmpty(boarder?.name)),
        ]),
    );
    sheet.mergeCells(boarderRow?.number, 1, boarderRow?.number, 2);
    sheet.mergeCells(boarderRow?.number, 3, boarderRow?.number, 4);
    sheet.mergeCells(boarderRow?.number, 5, boarderRow?.number, 6);
    sheet.mergeCells(boarderRow?.number, 7, boarderRow?.number, 8);
    sheet.mergeCells(boarderRow?.number, 9, boarderRow?.number, 10);
    sheet.mergeCells(boarderRow?.number, 11, boarderRow?.number, 12);
    sheet.mergeCells(boarderRow?.number, 13, boarderRow?.number, 14);
    sheet.mergeCells(boarderRow?.number, 15, boarderRow?.number, 16);


    // TelCardLogs
    const telCardLogHeaderRows = sheet.addRows([
        Array(16).fill('電話卡明細'),
        _.flatten([
            Array(2).fill('登記日期'),
            Array(2).fill('通話日期'),
            Array(6).fill('通話對象'),
            Array(6).fill('備註'),
        ]),
    ]);
    sheet.mergeCells(telCardLogHeaderRows[0].number, 1, telCardLogHeaderRows[0].number, 16);
    sheet.mergeCells(telCardLogHeaderRows[1].number, 1, telCardLogHeaderRows[1].number, 2);
    sheet.mergeCells(telCardLogHeaderRows[1].number, 3, telCardLogHeaderRows[1].number, 4);
    sheet.mergeCells(telCardLogHeaderRows[1].number, 5, telCardLogHeaderRows[1].number, 10);
    sheet.mergeCells(telCardLogHeaderRows[1].number, 11, telCardLogHeaderRows[1].number, 16);

    for(const it of telCardLogs) {
        const row = sheet.addRow(
            _.flatten([
                Array(2).fill(checkValueEmpty(it?.created_at, (v) => toSimpleDate(v))),
                Array(2).fill(checkValueEmpty(it?.contacted_at, (v) => toSimpleDate(v))),
                Array(6).fill(checkValueEmpty(it?.tel_card_contacter?.name)),
                Array(6).fill(checkValueEmpty(it?.remark)),
            ])
        );
        sheet.mergeCells(row?.number, 1, row?.number, 2);
        sheet.mergeCells(row?.number, 3, row?.number, 4);
        sheet.mergeCells(row?.number, 5, row?.number, 10);
        sheet.mergeCells(row?.number, 11, row?.number, 16);
        row.height = 24;
    }

    const telCardLogFooterRow = sheet.addRow(
        Array(16).fill(`已撥打 ${telCardLogs?.length ?? 0} 次`),
    );
    sheet.mergeCells(telCardLogFooterRow?.number, 1, telCardLogFooterRow?.number, 16);


    // PointLogs
    const pointLogHeaderRows = sheet.addRows([
        Array(16).fill('加扣點明細'),
        _.flatten([
            Array(2).fill('登記日期'),
            Array(1).fill('點數'),
            Array(1).fill('編號'),
            Array(6).fill('事由'),
            Array(6).fill('備註'),
        ]),
    ]);
    sheet.mergeCells(pointLogHeaderRows[0].number, 1, pointLogHeaderRows[0].number, 16);
    sheet.mergeCells(pointLogHeaderRows[1].number, 1, pointLogHeaderRows[1].number, 2);
    sheet.mergeCells(pointLogHeaderRows[1].number, 5, pointLogHeaderRows[1].number, 10);
    sheet.mergeCells(pointLogHeaderRows[1].number, 11, pointLogHeaderRows[1].number, 16);

    for(const it of pointLogs) {
        const row = sheet.addRow(
            _.flatten([
                Array(2).fill(checkValueEmpty(it?.created_at, (v) => toSimpleDate(v))),
                Array(1).fill(checkValueEmpty(it?.point)),
                Array(1).fill(checkValueEmpty(it?.point_rule?.code)),
                Array(6).fill(checkValueEmpty(it?.point_rule?.reason)),
                Array(6).fill(checkValueEmpty(it?.remark)),
            ])
        );
        sheet.mergeCells(row?.number, 1, row?.number, 2);
        sheet.mergeCells(row?.number, 5, row?.number, 10);
        sheet.mergeCells(row?.number, 11, row?.number, 16);
        row.height = 24 * Math.ceil(it?.point_rule?.reason?.length / 20);
    }
    if (telCardLogs?.[7]) {
        const row = sheet.addRow(
            _.flatten([
                Array(2).fill(checkValueEmpty(telCardLogs?.[7]?.created_at, (v) => toSimpleDate(v))),
                Array(1).fill(1),
                Array(1).fill('--'),
                Array(6).fill('電話卡已達8次'),
                Array(6).fill('--'),
            ])
        );
        sheet.mergeCells(row?.number, 1, row?.number, 2);
        sheet.mergeCells(row?.number, 5, row?.number, 10);
        sheet.mergeCells(row?.number, 11, row?.number, 16);
    }
    if (telCardLogs?.[15]) {
        const row = sheet.addRow(
            _.flatten([
                Array(2).fill(checkValueEmpty(telCardLogs?.[15]?.created_at, (v) => toSimpleDate(v))),
                Array(1).fill(1),
                Array(1).fill('--'),
                Array(6).fill('電話卡已達16次'),
                Array(6).fill('--'),
            ])
        );
        sheet.mergeCells(row?.number, 1, row?.number, 2);
        sheet.mergeCells(row?.number, 5, row?.number, 10);
        sheet.mergeCells(row?.number, 11, row?.number, 16);
    }
        
    const pointLogFooterRow = sheet.addRow(
        Array(16).fill(`共計 ${_.sumBy(pointLogs?.map((v) => v?.point)) + Math.floor(telCardLogs?.length / 8)} 點`),
    );
    sheet.mergeCells(pointLogFooterRow?.number, 1, pointLogFooterRow?.number, 16);

    const checkRows = sheet.addRows([
        Array(3).fill('住宿生確認簽章：'),
        Array(3).fill('承辦幹部：'),
        Array(16).fill(`列印日期：${format(Date.now(), 'yyyy-MM-dd')}`),
    ]);
    sheet.mergeCells(checkRows[0]?.number, 1, checkRows[0]?.number, 3);
    sheet.mergeCells(checkRows[1]?.number, 1, checkRows[1]?.number, 3);
    sheet.mergeCells(checkRows[2]?.number, 1, checkRows[2]?.number, 16);


    // 細部調整
    // 水平垂直置中 字體
    sheet.eachRow({ includeEmpty: true }, (row, index) => {
        row.font = { name: '標楷體', size: 12 };
        row.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
    sheet.pageSetup.fitToPage = true;
    sheet.pageSetup.fitToWidth = 1;
    sheet.pageSetup.paperSize = 9;
    headerRows[0].height = 40;
    headerRows[0].font = { name: '標楷體', size: 22 };
    headerRows[1].height = 40;
    headerRows[1].font= { name: '標楷體', size: 22 };
    boarderRow.height = 34;
    boarderRow.eachCell((v) => {
        if (!v.border) {
            v.border = {};
        }
        v.border.top = { style: 'thin' };
    });
    telCardLogHeaderRows[0].height = 32;
    telCardLogHeaderRows[0].font.bold = true;
    telCardLogHeaderRows[0].eachCell((v) => {
        if (!v.border) {
            v.border = {};
        }
        v.border.top = { style: 'thin' };
    });
    telCardLogHeaderRows[1].height = 24;
    telCardLogHeaderRows[1].eachCell((v) => {
        if (!v.border) {
            v.border = {};
        }
        v.border.top = { style: 'thin' };
    });
    telCardLogFooterRow.height = 30;
    telCardLogFooterRow.font.bold = true;
    telCardLogFooterRow.font.color = { argb: 'FFFF0000' };

    pointLogHeaderRows[0].height = 32;
    pointLogHeaderRows[0].font.bold = true;
    pointLogHeaderRows[0].eachCell((v) => {
        if (!v.border) {
            v.border = {};
        }
        v.border.top = { style: 'thin' };
    });
    pointLogHeaderRows[1].height = 24;
    pointLogHeaderRows[1].eachCell((v) => {
        if (!v.border) {
            v.border = {};
        }
        v.border.top = { style: 'thin' };
    });
    pointLogFooterRow.height = 30;
    pointLogFooterRow.font.bold = true;
    pointLogFooterRow.font.color = { argb: 'FFFF0000' };
    pointLogFooterRow.eachCell((v) => {
        if (!v.border) {
            v.border = {};
        }
        v.border.bottom = { style: 'thin' };
    });

    checkRows[0].height = 40;
    checkRows[0].font = { name: '標楷體', size: 16 };
    checkRows[1].height = 40;
    checkRows[1].font = { name: '標楷體', size: 16 };
    checkRows[2].height = 18;

    addOutterBorder(sheet);
}

export const createAreaSheet = (workbook: ExcelJS.Workbook, exportItems: ExportItem[], title: string = '統計表') => {
    const sheet = workbook?.addWorksheet(title);
    const validBoarders = exportItems?.filter((v) => v?.point_logs?.length > 0 || Math.floor(v?.tel_card_logs.length / 8) > 0)
    const maxRecordCount = _.max(validBoarders?.map((v) => v?.point_logs.length + Math.floor(v?.tel_card_logs.length / 8))) ?? 0;
    

    // Header
    let headerRows = sheet.addRows([
        Array(8 + maxRecordCount).fill('國立臺中科技大學'),
        Array(8 + maxRecordCount).fill('學生宿舍住宿生加扣點明細'),
    ]);
    for(const it of headerRows) {
        sheet.mergeCells(it?.number, 1, it?.number, 8 + maxRecordCount);
    }


    // ListHeader
    const listHeaderRow = sheet.addRow(
        _.flatten([
            Array(2).fill('樓寢床'),
            Array(2).fill('姓名'),
            Array(1).fill(''),
            _.range(1, maxRecordCount + 1),
            Array(1).fill('合計'),
            Array(2).fill('簽名確認'),
        ]),
    );
    sheet.mergeCells(listHeaderRow?.number, 1, listHeaderRow?.number, 2);
    sheet.mergeCells(listHeaderRow?.number, 3, listHeaderRow?.number, 4);
    sheet.mergeCells(listHeaderRow?.number, 6 + maxRecordCount + 1, listHeaderRow?.number, 6 + maxRecordCount + 2);


    // ListItem
    for (const v of validBoarders) {
        const telCardPointList: { created_at: string, point: number }[] = [];
        const boarder = v?.boarder;
        const pointLogs = v?.point_logs;
        const telCardLogs = v?.tel_card_logs;
        const tatalPoint = _.sumBy(pointLogs, (v) => v?.point) + Math.floor(telCardLogs.length / 8);

        if (telCardLogs?.[7]) {
            telCardPointList?.push({
                created_at: telCardLogs?.[7].created_at,
                point: 1,
            });
        }
        if (telCardLogs?.[15]) {
            telCardPointList?.push({
                created_at: telCardLogs?.[15].created_at,
                point: 1,
            });
        }

        // Date
        const dateRow = sheet.addRow(
            _.flatten([
                Array(2).fill(toStringlish(boarder?.project_bunk)),
                Array(2).fill(hideMiddle(boarder?.name!)),
                Array(1).fill('加點日期'),
                pointLogs?.map((v) => format(new Date(v?.created_at), 'MMdd')),
                telCardPointList?.map((v) => format(new Date(v?.created_at), 'MMdd')),
            ])
        );
        // Code
        const codeRow = sheet.addRow(
            _.flatten([
                Array(2).fill(toStringlish(boarder?.project_bunk)),
                Array(2).fill(''),
                Array(1).fill('加點編號'),
                pointLogs?.map((v) => v?.point_rule?.code),
                telCardPointList?.map((v) => '電話卡'),
            ])
        );
        // Point
        const pointRow = sheet.addRow(
            _.flatten([
                Array(2).fill(toStringlish(boarder?.project_bunk)),
                Array(2).fill(''),
                Array(1).fill('點數'),
                pointLogs?.map((v) => v?.point),
                telCardPointList?.map((v) => 1),
            ])
        );

        dateRow.getCell(6 + maxRecordCount).value = tatalPoint;

        sheet.mergeCells(dateRow?.number, 1, pointRow?.number, 2);
        sheet.mergeCells(dateRow?.number, 3, pointRow?.number, 4);
        sheet.mergeCells(dateRow?.number, 6 + maxRecordCount, pointRow?.number, 6 + maxRecordCount);
        sheet.mergeCells(dateRow?.number, 6 + maxRecordCount + 1, pointRow?.number, 6 + maxRecordCount + 2);
    }

    const checkRows = sheet.addRows([
        Array(3).fill('樓層組長：'),
        Array(3).fill('大隊長：'),
        Array(8 + maxRecordCount).fill(`列印日期：${format(Date.now(), 'yyyy-MM-dd')}`),
    ]);
    sheet.mergeCells(checkRows[0]?.number, 1, checkRows[0]?.number, 3);
    sheet.mergeCells(checkRows[1]?.number, 1, checkRows[1]?.number, 3);
    sheet.mergeCells(checkRows[2]?.number, 1, checkRows[2]?.number, 8 + maxRecordCount);


    // 細部調整
    // 水平垂直置中 字體
    sheet.eachRow({ includeEmpty: true }, (row, index) => {
        row.font = { name: '標楷體', size: 12 };
        row.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
    sheet.pageSetup.fitToPage = true;
    sheet.pageSetup.fitToWidth = 1;
    sheet.pageSetup.paperSize = 9;
    sheet.pageSetup.orientation = 'landscape',
    headerRows[0].height = 40;
    headerRows[0].font = { name: '標楷體', size: 22 };
    headerRows[1].height = 40;
    headerRows[1].font= { name: '標楷體', size: 22 };
    // boarderRow.height = 34;
    // boarderRow.eachCell((v) => {
    //     if (!v.border) {
    //         v.border = {};
    //     }
    //     v.border.top = { style: 'thin' };
    // });
    // telCardLogHeaderRows[0].height = 32;
    // telCardLogHeaderRows[0].font.bold = true;
    // telCardLogHeaderRows[0].eachCell((v) => {
    //     if (!v.border) {
    //         v.border = {};
    //     }
    //     v.border.top = { style: 'thin' };
    // });
    // telCardLogHeaderRows[1].height = 24;
    // telCardLogHeaderRows[1].eachCell((v) => {
    //     if (!v.border) {
    //         v.border = {};
    //     }
    //     v.border.top = { style: 'thin' };
    // });
    // telCardLogFooterRow.height = 30;
    // telCardLogFooterRow.font.bold = true;
    // telCardLogFooterRow.font.color = { argb: 'FFFF0000' };

    // pointLogHeaderRows[0].height = 32;
    // pointLogHeaderRows[0].font.bold = true;
    // pointLogHeaderRows[0].eachCell((v) => {
    //     if (!v.border) {
    //         v.border = {};
    //     }
    //     v.border.top = { style: 'thin' };
    // });
    // pointLogHeaderRows[1].height = 24;
    // pointLogHeaderRows[1].eachCell((v) => {
    //     if (!v.border) {
    //         v.border = {};
    //     }
    //     v.border.top = { style: 'thin' };
    // });
    // pointLogFooterRow.height = 30;
    // pointLogFooterRow.font.bold = true;
    // pointLogFooterRow.font.color = { argb: 'FFFF0000' };
    // pointLogFooterRow.eachCell((v) => {
    //     if (!v.border) {
    //         v.border = {};
    //     }
    //     v.border.bottom = { style: 'thin' };
    // });

    checkRows[0].height = 40;
    checkRows[0].font = { name: '標楷體', size: 16 };
    checkRows[1].height = 40;
    checkRows[1].font = { name: '標楷體', size: 16 };
    checkRows[2].height = 18;

    addOutterBorder(sheet);
}

const addOutterBorder = (sheet: ExcelJS.Worksheet) => {
    sheet.getColumn(1).eachCell((v) => {
        if (!v.border) {
            v.border = {};
        }
        v.border.left = { style: 'thin' };
    });
    sheet.lastColumn.eachCell((v) => {
        if (!v.border) {
            v.border = {};
        }
        v.border.right = { style: 'thin' };
    });
    sheet.getRow(1).eachCell((v) => {
        if (!v.border) {
            v.border = {};
        }
        v.border.top = { style: 'thin' };
    });
    sheet.lastRow?.eachCell((v) => {
        if (!v.border) {
            v.border = {};
        }
        v.border.bottom = { style: 'thin' };
    });
}