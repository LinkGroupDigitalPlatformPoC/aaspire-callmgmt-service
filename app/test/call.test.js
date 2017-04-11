var expect = require('chai').expect;
var Call = require("../src/call");


describe("Testing the Call Class", function(){

	describe("testing the constructur", function(){
		
		it("testForMandatoryFieldMemberId", function(){

			const body = {};
			
			expect(() => new Call(body)).to.throw("Must have memberId");
		});

		it("testForMandatoryFieldDateTimeInitiated", function(){

			const body = {memberId: '123'};
			
			expect(() => new Call(body)).to.throw("Must have Date Time Initiated");
		});
		
		it("testForMandatoryFieldStatus", function(){

			const body = {memberId: '123', dateTimeInitiated: '1234'};
			
			expect(() => new Call(body)).to.throw("Must have status");
		});

		it("createACallSuccessfully", function(){

			const body = {memberId: '123', dateTimeInitiated: '1234', status: 'completed'};
			var actualOutput = new Call(body);
			expect(actualOutput).to.deep.equal({ memberId: '123', 
				                                 dateTimeInitiated:'1234', 
				                                 status: 'completed', 
				                                 dateTimeCompleted: undefined, 
				                                 notes: undefined, 
				                                 primaryTopic: undefined, 
				                                 secondaryTopic: undefined});
			
		});
		
		
	});
	
 });
